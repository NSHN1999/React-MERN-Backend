const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarToken } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        message: `Ya existe el usuario ${usuario.email}`
      });
    };

    usuario = new Usuario(req.body);

    //TODO: encriptar contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save();

    //Generar JWT
    const token = await generarToken(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador'
    });
  };
};

const loginUsuario = async (req, res = response) => {

  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        message: `No existe el usuario ${email}`
      });
    };

    const isValidPassword = bcrypt.compareSync(password, usuario.password);

    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Contraseña incorrecta'
      });
    };

    //Generar nuestro JWT
    const token = await generarToken(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador'
    });
  }
};

const revalidarToken = async (req, res = response) => {

  const { uid, name } = req;

  const token = await generarToken(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
};
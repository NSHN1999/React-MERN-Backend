const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
  //x-token-header
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'No hay token en la petición'
    });
  };

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = payload.uid;
    req.name = payload.name;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token inválido'
    });
  };
};

module.exports = {
  validarJWT
}
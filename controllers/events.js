const { response } = require('express');
const Evento = require('../models/Evento');

const crearEventos = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    res.status(200).json({
      ok: true,
      message: 'crearEventos',
      eventoGuardado
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      message: 'Error al crear evento',
    });
  }
};

const getEventos = async (req, res = response) => {
  try {
    const eventos = await Evento.find().populate('user', 'name');

    res.status(200).json({
      ok: true,
      message: 'getEventos',
      eventos
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: true,
      message: 'Error al listar eventos',
    });
  }
};

const actualizarEventos = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "El evento no existe por ese id"
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        message: "No tiene privilegio de editar este evento"
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

    res.status(200).json({
      ok: true,
      message: 'Evento actualializado',
      evento: eventoActualizado
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: true,
      message: 'Error al actualizar evento',
    });
  }
};

const eliminarEventos = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "El evento no existe por este id"
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        message: "No tiene privilegio para eliminar"
      });
    }

    const { title } = await Evento.findByIdAndDelete(eventoId, { new: true });

    res.status(200).json({
      ok: true,
      message: `El evento ha sido eliminado`,
      title
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: true,
      message: 'Error al eliminar evento',
    });
  }
};

module.exports = {
  crearEventos,
  getEventos,
  actualizarEventos,
  eliminarEventos
};
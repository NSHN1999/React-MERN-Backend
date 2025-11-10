/*
  Rutas de Eventos: Events
  host + /api/events
*/

const { Router } = require("express");
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { isDate } = require("../helpers/isDate");
const { getEventos, crearEventos, actualizarEventos, eliminarEventos } = require('../controllers/events');

router.use(validarJWT);

//Obtener eventos
router.get('/', getEventos);

//Crear evento
router.post('/',
  [//middlewares
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
  ],
  crearEventos
);

//Actualizar evento
router.put('/:id',
  [//middlewares
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
  ],
  actualizarEventos
);

//Eliminar evento
router.delete('/:id', eliminarEventos);

module.exports = router;
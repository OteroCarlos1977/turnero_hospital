const express = require("express");

const seguridad = require ('./seguridad');
const respuesta = require("../../red/respuestas");
const controlador = require("./index");
const router = express.Router();
const proteger = seguridad();

router.get("/", todos);
router.get("/usuarios/", proteger, usuarios);
router.get("/usuario/:usuario", proteger, un_usuario);
router.get("/:id", proteger, uno);
router.post("/", proteger, agregar);
router.put("/", proteger, eliminar);

async function todos(req, res, next) {
  try {
    const items = await controlador.todos();
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function uno(req, res, next) {
  try {
    const items = await controlador.uno(req.params.id);
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function usuarios(req, res, next) {
  try {
    const items = await controlador.usuarios();
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function un_usuario(req, res, next) {
  try {
    const items = await controlador.un_usuario(req.params.usuario);
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
}

async function agregar(req, res, next) {
    try {
      const items = await controlador.agregar(req.body);

      let mensaje = '';
      if(req.body.id == 0) {
        mensaje = 'Registro guardado con éxito';
      }else {
        mensaje = 'Registro actualizado con éxito';
      }
      respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
  }

async function eliminar(req, res, next) {
    try {
      const items = await controlador.eliminar(req.body);
      respuesta.success(req, res, 'Registro eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
  }

module.exports = router;

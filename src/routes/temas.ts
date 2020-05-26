import { Router } from 'express'
import { TemasController } from '../controller/TemasController'

const router = Router()

router.get('/temas', TemasController.obtenerTemas)
router.get('/temas/:id(\\d+)/', TemasController.obtenerTema)
router.get('/temas/count', TemasController.contarTemas)
router.post('/temas', TemasController.crearTema)
router.put('/temas/:id(\\d+)/', TemasController.actualizarTema)

export default router
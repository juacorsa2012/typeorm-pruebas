import { Router } from 'express'
import { TemasController } from '../controller/TemasController'

const router = Router()

router.get('/temas', TemasController.obtenerTemas)
router.get('/temas/:id', TemasController.obtenerTema)
router.post('/temas', TemasController.crearTema)
router.put('/temas/:id', TemasController.actualizarTema)

export default router
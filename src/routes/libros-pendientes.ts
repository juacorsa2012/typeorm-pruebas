import { Router } from 'express'
import { LibrosPendientesController } from '../controller/LibrosPendientesController'

const router = Router()

router.get('/libros-pendientes', LibrosPendientesController.obtenerLibros)
router.get('/libros-pendientes/:id', LibrosPendientesController.obtenerLibro)
router.post('/libros-pendientes', LibrosPendientesController.crearLibro)
router.delete('/libros-pendientes/:id', LibrosPendientesController.borrarLibro)
router.put('/libros-pendientes/:id', LibrosPendientesController.actualizarLibro)

export default router
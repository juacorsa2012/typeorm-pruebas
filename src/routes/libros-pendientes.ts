import { Router } from 'express'
import { LibrosPendientesController } from '../controller/LibrosPendientesController'

const router = Router()

router.get('/libros-pendientes', LibrosPendientesController.obtenerLibros)
router.get('/libros-pendientes/:id(\\d+)/', LibrosPendientesController.obtenerLibro)
router.post('/libros-pendientes', LibrosPendientesController.crearLibro)
router.delete('/libros-pendientes/:id(\\d+)/', LibrosPendientesController.borrarLibro)
router.put('/libros-pendientes/:id(\\d+)/', LibrosPendientesController.actualizarLibro)
router.get('/libros-pendientes/count', LibrosPendientesController.contarLibros)

export default router
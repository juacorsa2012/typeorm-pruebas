import { Router } from 'express'
import { LibrosController } from '../controller/LibrosController'

const router = Router()

router.get('/libros', LibrosController.obtenerLibros)
router.get('/libros/count', LibrosController.contarLibros)
router.post('/libros', LibrosController.crearLibro)



/*
router.get('/libros-pendientes/:id(\\d+)/', LibrosPendientesController.obtenerLibro)

router.delete('/libros-pendientes/:id(\\d+)/', LibrosPendientesController.borrarLibro)
router.put('/libros-pendientes/:id(\\d+)/', LibrosPendientesController.actualizarLibro)

*/
export default router
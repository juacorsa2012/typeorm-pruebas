import { Router } from 'express'
import { LibrosController } from '../controller/LibrosController'

const router = Router()

router.get('/libros', LibrosController.obtenerLibros)
router.get('/libros/count', LibrosController.contarLibros)
router.post('/libros', LibrosController.crearLibro)
router.get('/libros/:id(\\d+)/', LibrosController.obtenerLibro)
router.delete('/libros/:id(\\d+)/', LibrosController.borrarLibro)
router.put('/libros/:id(\\d+)/', LibrosController.actualizarLibro)

export default router
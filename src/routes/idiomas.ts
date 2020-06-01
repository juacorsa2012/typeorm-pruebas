import { Router } from 'express'
import { IdiomasController } from '../controller/IdiomasController'

const router = Router()

router.get('/idiomas', IdiomasController.obtenerIdiomas)
router.get('/idiomas/:id(\\d+)/', IdiomasController.obtenerIdioma)
router.get('/idiomas/count', IdiomasController.contarIdiomas)
router.post('/idiomas', IdiomasController.crearIdioma)
router.put('/idiomas/:id(\\d+)/', IdiomasController.actualizarIdioma)

export default router
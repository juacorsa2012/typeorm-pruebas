import { Router } from 'express'
import { FabricantesController } from '../controller/FabricantesController'

const router = Router()

router.get('/fabricantes', FabricantesController.obtenerFabricantes)
router.get('/fabricantes/:id(\\d+)/', FabricantesController.obtenerFabricante)
router.post('/fabricantes', FabricantesController.crearFabricante)
router.put('/fabricantes/:id(\\d+)/', FabricantesController.actualizarFabricante)
router.get('/fabricantes/count', FabricantesController.contarFabricantes)

export default router
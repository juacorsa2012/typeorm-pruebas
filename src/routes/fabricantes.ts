import { Router } from 'express'
import { FabricantesController } from '../controller/FabricantesController'

const router = Router()

router.get('/fabricantes', FabricantesController.obtenerFabricantes)
router.get('/fabricantes/:id', FabricantesController.obtenerFabricante)
router.post('/fabricantes', FabricantesController.crearFabricante)
router.put('/fabricantes/:id', FabricantesController.actualizarFabricante)

export default router
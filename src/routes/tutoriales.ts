import { Router } from 'express'
import { TutorialesController } from '../controller/TutorialesController'

const router = Router()

router.get('/tutoriales', TutorialesController.obtenerTutoriales)
router.get('/tutoriales/:id(\\d+)/', TutorialesController.obtenerTutorial)
router.get('/tutoriales/count', TutorialesController.contarTutoriales)
router.post('/tutoriales', TutorialesController.crearTutorial)
router.delete('/tutoriales/:id(\\d+)/', TutorialesController.borrarTutorial)
//router.put('/tutoriales-pendientes/:id(\\d+)/', TutorialesPendientesController.actualizarTutorial)

export default router
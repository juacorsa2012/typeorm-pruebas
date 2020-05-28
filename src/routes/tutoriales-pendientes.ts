import { Router } from 'express'
import { TutorialesPendientesController } from '../controller/TutorialesPendientesController'

const router = Router()

router.get('/tutoriales-pendientes', TutorialesPendientesController.obtenerTutoriales)
router.get('/tutoriales-pendientes/:id(\\d+)/', TutorialesPendientesController.obtenerTutorial)
router.get('/tutoriales-pendientes/count', TutorialesPendientesController.contarTutoriales)
router.post('/tutoriales-pendientes', TutorialesPendientesController.crearTutorial)
router.delete('/tutoriales-pendientes/:id(\\d+)/', TutorialesPendientesController.borrarTutorial)
router.put('/tutoriales-pendientes/:id(\\d+)/', TutorialesPendientesController.actualizarTutorial)

export default router
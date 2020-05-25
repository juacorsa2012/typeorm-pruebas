import { Router } from 'express'
import { TutorialesPendientesController } from '../controller/TutorialesPendientesController'

const router = Router()

router.get('/tutoriales-pendientes', TutorialesPendientesController.obtenerTutoriales)
router.get('/tutoriales-pendientes/:id', TutorialesPendientesController.obtenerTutorial)
router.post('/tutoriales-pendientes', TutorialesPendientesController.crearTutorial)
router.delete('/tutoriales-pendientes/:id', TutorialesPendientesController.borrarTutorial)
router.put('/tutoriales-pendientes/:id', TutorialesPendientesController.actualizarTutorial)

export default router
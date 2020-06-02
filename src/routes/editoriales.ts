import { Router } from 'express'
import { EditorialesController } from '../controller/EditorialesController'

const router = Router()

router.get('/editoriales', EditorialesController.obtenerEditoriales)
router.get('/editoriales/:id(\\d+)/', EditorialesController.obtenerEditorial)
router.get('/editoriales/count', EditorialesController.contarEditoriales)
router.post('/editoriales', EditorialesController.crearEditorial)
router.put('/editoriales/:id(\\d+)/', EditorialesController.actualizarEditorial)

export default router
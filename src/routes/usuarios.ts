import { Router } from 'express'
import { UsuariosController } from '../controller/UsuariosController'

const router = Router()

router.post('/usuarios', UsuariosController.crearUsuario)

export default router
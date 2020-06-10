import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import  * as bcrypt from  'bcryptjs'
import * as HttpStatus from  'http-status-codes'
import * as Message from '../messages'
import { Usuario } from '../entity/Usuario'
import Util from '../util/Util'

export class UsuariosController {
    static crearUsuario = async (req: Request, res: Response) => {                       
        const  { email, password, rol } = req.body

        const usuario = new Usuario()
        usuario.email = email
        usuario.password = password
        usuario.rol = rol
        
        const errors = await validate(usuario)
        if (errors.length > 0) {            
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Usuario)
        try {
            const salt = bcrypt.genSaltSync(10)
            usuario.password = bcrypt.hashSync(password, salt)
            await repo.save(usuario)
            res.status(HttpStatus.CREATED).json({ 
                success: true,                 
                message: Message.USUARIO_REGISTRADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.CONFLICT).json({ 
                    success: false, 
                    message: Message.USUARIO_YA_EXISTE
                })    
            }            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }
}
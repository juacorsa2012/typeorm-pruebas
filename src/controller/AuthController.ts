import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import * as HttpStatus from  'http-status-codes'
import  * as bcrypt from  'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as Message from '../messages'
import { Usuario } from '../entity/Usuario'

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body

        if (! (email && password)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: Message.CREDENCIALES_INCORRECTAS
            })
        }

        const repo = getRepository(Usuario)
        let usuario: Usuario

        

        try {
            usuario = await repo.findOneOrFail({ email })    
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: Message.CREDENCIALES_INCORRECTAS
            })            
        }       

        if (! bcrypt.compareSync(password, usuario.password)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: Message.CREDENCIALES_INCORRECTAS
            })            
        }

        const id = usuario.id
        const token = jwt.sign({ id, email }, 'JWT_SECRET', { expiresIn: '1h' })

        return res.status(HttpStatus.OK).json({ token })
    }
}
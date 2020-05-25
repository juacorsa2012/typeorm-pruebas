import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import * as Message from '../messages'
import { Tema } from '../entity/Tema'
import Util from '../util/Util'

// https://www.bookstack.cn/read/TypeORM/select-query-builder.md#Adding%20%3Ccode%3EORDER%20BY%3C/code%3E%20expression

export class TemasController {
    static crearTema = async (req: Request, res: Response) => {               
        const tema = getRepository(Tema).create(req.body)       
        const errors = await validate(tema, { validationError: { target: false } })               

        if (errors.length > 0) {
            const error = Util.ObtenerMensajeError(errors)

            return res.status(400).json({ 
                success: false, 
                message: error                
            })
        }

        const repo = getRepository(Tema)
        try {
            await repo.save(tema)
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: tema,
                message: Message.TEMA_REGISTRADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.CONFLICT).json({ 
                    success: false, 
                    message: Message.TEMA_YA_EXISTE
                })    
            }            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static obtenerTemas = async (req: Request, res: Response) => {        
        const { nombre, ordenar } = req.query

        const repo = getRepository(Tema)                
        const query = repo.createQueryBuilder('tema')               
        
        if (nombre) {
            query.andWhere('tema.nombre LIKE :nombre', { nombre: `%${nombre}%` })
        }
        
        if (ordenar) {            
            const direccion: string = ordenar.toString().split(':')[1].toUpperCase()
            if (direccion === 'DESC') {
                query.orderBy('tema.nombre', 'DESC')
            } else {
                query.orderBy('tema.nombre', 'ASC')
            }
        }

        try {
            const temas = await query.getMany()                
            return res.status(HttpStatus.OK).json({ 
                success: true,
                count: temas.length, 
                data: temas 
            })            
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: Message.IMPOSIBLE_COMPLETAR_ACCION               
            })            
        }
    }

    static obtenerTema = async (req: Request, res: Response) => {
        const { id } = req.params        

        const existe = await Util.ExisteTema(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TEMA_NO_ENCONTRADO
            })
        }        

        try {
            const tema = await getRepository(Tema).findOne(id)
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                data: tema 
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }        
    }

    static actualizarTema = async (req: Request, res: Response) => {
        const { id } = req.params
        
        const existe = await Util.ExisteTema(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TEMA_NO_ENCONTRADO
            })
        }                

        let tema = getRepository(Tema).create(req.body)        

        const errors = await validate(tema, { validationError: { target: false } })

        if (errors.length > 0) {
            const error = Util.ObtenerMensajeError(errors)

            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: error
            })
        }

        const { nombre } = req.body
        const repo = getRepository(Tema)
        
        try {                                          
            let tema = await repo.findOne(id)
            tema.nombre = nombre
            await repo.save(tema)
            return res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: tema,
                message: Message.TEMA_ACTUALIZADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    success: false, 
                    message: Message.TEMA_YA_EXISTE
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
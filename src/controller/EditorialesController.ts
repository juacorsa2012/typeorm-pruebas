import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import * as Message from '../messages'
import { Editorial } from '../entity/Editorial'
import Util from '../util/Util'

export class EditorialesController {
    static crearEditorial = async (req: Request, res: Response) => {               
        const editorial = getRepository(Editorial).create(req.body)       
        const errors = await validate(editorial)

        if (errors.length > 0) {            
            return res.status(400).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Editorial)
        try {
            await repo.save(editorial)
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: editorial,
                message: Message.EDITORIAL_REGISTRADA_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.CONFLICT).json({ 
                    success: false, 
                    message: Message.EDITORIAL_YA_EXISTE
                })    
            }            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static contarEditoriales = async (req: Request, res: Response) => {
        const total = await getRepository(Editorial).count()              

        return res.status(HttpStatus.OK).json({
            success: true,
            count: total
        })
    }

    static obtenerEditoriales = async (req: Request, res: Response) => {        
        const { nombre, ordenar } = req.query

        const repo = getRepository(Editorial)
        const query = repo.createQueryBuilder('editorial')               
        
        if (nombre) {
            query.andWhere('editorial.nombre LIKE :nombre', { nombre: `%${nombre}%` })
        }
        
        if (ordenar) {            
            const direccion: string = ordenar.toString().split(':')[1].toUpperCase()
            if (direccion === 'DESC') {
                query.orderBy('editorial.nombre', 'DESC')
            } else {
                query.orderBy('editorial.nombre', 'ASC')
            }
        }

        try {
            const editoriales = await query.getMany()                
            return res.status(HttpStatus.OK).json({ 
                success: true,
                count: editoriales.length, 
                data: editoriales
            })            
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: Message.IMPOSIBLE_COMPLETAR_ACCION               
            })            
        }
    }

    static obtenerEditorial = async (req: Request, res: Response) => {
        const { id } = req.params        

        const existe = await Util.ExisteEditorial(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.EDITORIAL_NO_EXISTE
            })
        }        

        try {
            const editorial = await getRepository(Editorial).findOne(id)
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                data: editorial
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }        
    }

    static actualizarEditorial = async (req: Request, res: Response) => {
        const { id } = req.params
        
        const existe = await Util.ExisteEditorial(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.EDITORIAL_NO_EXISTE
            })
        }                

        let editorial = getRepository(Editorial).create(req.body)        

        const errors = await validate(editorial)

        if (errors.length > 0) {           
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const { nombre } = req.body
        const repo = getRepository(Editorial)
        
        try {                                          
            let editorial = await repo.findOne(id)
            editorial.nombre = nombre
            await repo.save(editorial)
            return res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: editorial,
                message: Message.EDITORIAL_ACTUALIZADA_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    success: false, 
                    message: Message.EDITORIAL_YA_EXISTE
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
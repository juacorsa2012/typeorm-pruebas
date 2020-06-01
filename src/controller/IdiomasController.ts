import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import * as Message from '../messages'
import { Idioma } from '../entity/Idioma'
import Util from '../util/Util'

export class IdiomasController {
    static crearIdioma = async (req: Request, res: Response) => {               
        const idioma = getRepository(Idioma).create(req.body)       
        const errors = await validate(idioma)

        if (errors.length > 0) {            
            return res.status(400).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Idioma)
        try {
            await repo.save(idioma)
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: idioma,
                message: Message.IDIOMA_REGISTRADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.CONFLICT).json({ 
                    success: false, 
                    message: Message.IDIOMA_YA_EXISTE
                })    
            }            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static contarIdiomas = async (req: Request, res: Response) => {
        const total = await getRepository(Idioma).count()              

        return res.status(HttpStatus.OK).json({
            success: true,
            count: total
        })
    }

    static obtenerIdiomas = async (req: Request, res: Response) => {        
        const { nombre, ordenar } = req.query

        const repo = getRepository(Idioma)                
        const query = repo.createQueryBuilder('idioma')               
        
        if (nombre) {
            query.andWhere('idioma.nombre LIKE :nombre', { nombre: `%${nombre}%` })
        }
        
        if (ordenar) {            
            const direccion: string = ordenar.toString().split(':')[1].toUpperCase()
            if (direccion === 'DESC') {
                query.orderBy('idioma.nombre', 'DESC')
            } else {
                query.orderBy('idioma.nombre', 'ASC')
            }
        }

        try {
            const idiomas = await query.getMany()                
            return res.status(HttpStatus.OK).json({ 
                success: true,
                count: idiomas.length, 
                data: idiomas
            })            
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: Message.IMPOSIBLE_COMPLETAR_ACCION               
            })            
        }
    }

    static obtenerIdioma = async (req: Request, res: Response) => {
        const { id } = req.params        

        const existe = await Util.ExisteIdioma(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.IDIOMA_NO_ENCONTRADO
            })
        }        

        try {
            const idioma = await getRepository(Idioma).findOne(id)
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                data: idioma
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }        
    }

    static actualizarIdioma = async (req: Request, res: Response) => {
        const { id } = req.params
        
        const existe = await Util.ExisteIdioma(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.IDIOMA_NO_ENCONTRADO
            })
        }                

        let idioma = getRepository(Idioma).create(req.body)        

        const errors = await validate(idioma)

        if (errors.length > 0) {           
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const { nombre } = req.body
        const repo = getRepository(Idioma)
        
        try {                                          
            let idioma = await repo.findOne(id)
            idioma.nombre = nombre
            await repo.save(idioma)
            return res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: idioma,
                message: Message.IDIOMA_ACTUALIZADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    success: false, 
                    message: Message.IDIOMA_YA_EXISTE
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
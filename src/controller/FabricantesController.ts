import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import * as Message from '../messages'
import { Fabricante } from '../entity/Fabricante'
import Util from  '../util/Util'

// https://www.bookstack.cn/read/TypeORM/select-query-builder.md#Adding%20%3Ccode%3EORDER%20BY%3C/code%3E%20expression

export class FabricantesController {
    static crearFabricante = async (req: Request, res: Response) => {               
        const fabricante = getRepository(Fabricante).create(req.body)        

        const errors = await validate(fabricante)

        if (errors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Fabricante)
        try {
            await repo.save(fabricante)
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: fabricante,
                message: Message.FABRICANTE_REGISTRADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.CONFLICT).json({ 
                    success: false, 
                    message: Message.FABRICANTE_YA_EXISTE
                })    
            }            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static obtenerFabricantes = async (req: Request, res: Response) => {        
        const { nombre, ordenar } = req.query

        const repo = getRepository(Fabricante)
        const query = repo.createQueryBuilder('fabricante')               
        
        if (nombre) {
            query.andWhere('fabricante.nombre LIKE :nombre', { nombre: `%${nombre}%` })
        }
        
        if (ordenar) {            
            const direccion: string = ordenar.toString().split(':')[1].toUpperCase()
            if (direccion === 'DESC') {
                query.orderBy('fabricante.nombre', 'DESC')
            } else {
                query.orderBy('fabricante.nombre', 'ASC')
            }
        }

        try {
            const fabricantes = await query.getMany()                
            return res.status(HttpStatus.OK).json({ 
                success: true,
                count: fabricantes.length, 
                data: fabricantes
            })            
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: Message.IMPOSIBLE_COMPLETAR_ACCION               
            })            
        }
    }

    static obtenerFabricante = async (req: Request, res: Response) => {
        const { id } = req.params

        const existe = await Util.ExisteFabricante(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.FABRICANTE_NO_ENCONTRADO
            })
        }        

        try {
            const fabricante = await getRepository(Fabricante).findOneOrFail(id)
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                data: fabricante
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }        
    }

    static contarFabricantes = async (req: Request, res: Response) => {
        const total = await getRepository(Fabricante).count()              

        return res.status(HttpStatus.OK).json({
            success: true,
            count: total
        })
    }

    static actualizarFabricante = async (req: Request, res: Response) => {
        const { id } = req.params
        
        const existe = await Util.ExisteFabricante(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.FABRICANTE_NO_ENCONTRADO
            })
        }                

        let fabricante = getRepository(Fabricante).create(req.body)        

        const errors = await validate(fabricante)

        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const { nombre } = req.body
        const repo = getRepository(Fabricante)
        
        try {                                          
            let fabricante = await repo.findOne(id)
            fabricante.nombre = nombre
            await repo.save(fabricante)
            return res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: fabricante,
                message: Message.FABRICANTE_ACTUALIZADO_CORRECTAMENTE
            })
        } catch (e) {
            if (e.sqlState === '23000') {
                return res.status(HttpStatus.BAD_REQUEST).json({ 
                    success: false, 
                    message: Message.FABRICANTE_YA_EXISTE
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

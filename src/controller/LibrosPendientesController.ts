import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import { LibroPendiente  } from '../entity/LibroPendiente'
import { Editorial  } from '../entity/Editorial'
import * as Message from '../messages'
import Util from '../util/Util'

export class LibrosPendientesController {
    static obtenerLibros = async (req: Request, res: Response) => {
        const { titulo, ordenar } = req.query
        const librosPendientesRepository = getRepository(LibroPendiente) 

        const query = librosPendientesRepository
            .createQueryBuilder('libro')            
            .leftJoinAndSelect("libro.editorial", "editorial")

        if (titulo) {
            query.andWhere('libro.titulo LIKE :titulo', { titulo: `%${titulo}%` })
        }
    
        if (ordenar) {            
            const direccion: string = ordenar.toString().split(':')[1].toUpperCase()
            if (direccion === 'DESC') {
                query.orderBy('libro.titulo', 'DESC')
            } else {
                query.orderBy('libro.titulo', 'ASC')
            }
        }           

        let libros: any[]
        try {
            libros = await query.getMany()    
            return res.status(HttpStatus.OK).json({ 
                success: true,
                count: libros.length, 
                data: libros 
            })    
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })                
        }        
    }

    static obtenerLibro = async (req: Request, res: Response) => {
        const { id } = req.params        

        const existe = await Util.ExisteLibro(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.LIBRO_NO_ENCONTRADO              
            })
        }        
        
        const query = getRepository(LibroPendiente)
            .createQueryBuilder('libro')            
            .leftJoinAndSelect("libro.editorial", "editorial")            
            .where("libro.id = :id")
            .setParameter("id", id)        

        try {
            const libro = await query.getOne()
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                data: libro 
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static contarLibros = async (req: Request, res: Response) => {
        const total = await getRepository(LibroPendiente).count()              

        return res.status(HttpStatus.OK).json({
            success: true,
            count: total
        })
    }

    static crearLibro = async (req: Request, res: Response) => {
        const { titulo, observaciones, editorial } = req.body          
               
        const existe = await Util.ExisteEditorial(+editorial)

        if (!existe) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.EDITORIAL_NO_EXISTE 
            })
        }        

        const libro = new LibroPendiente()
        libro.titulo = titulo
        libro.observaciones = observaciones
        libro.editorial = await getRepository(Editorial).findOne(editorial)
        
        const errors = await validate(libro, { validationError: { target: false } })
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(LibroPendiente)                
        
        try {
            await repo.save(libro)
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: libro,
                message: Message.LIBRO_REGISTRADO_CORRECTAMENTE
            })
        } catch (e) {            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,                 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static borrarLibro = async (req: Request, res: Response) => {
        const { id } = req.params     
        
        const existe = await Util.ExisteEditorial(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.LIBRO_NO_ENCONTRADO              
            })
        }

        try {
            await getRepository(LibroPendiente).delete(id)
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                message: Message.LIBRO_BORRADO_CORRECTAMENTE 
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message                 
            })
        }
    }

    static actualizarLibro = async (req: Request, res: Response) => {
        const { id } = req.params             
        
        let existe = await Util.ExisteLibro(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.LIBRO_NO_ENCONTRADO              
            })
        }

        const { titulo, observaciones, editorial } = req.body

        existe = await Util.ExisteEditorial(+editorial)

        if (!existe) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.EDITORIAL_NO_EXISTE 
            })
        }

        let libro = getRepository(LibroPendiente).create(req.body)
        
        const errors = await validate(libro)
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(LibroPendiente)

        try {
            let libro = await repo.findOne(id)
            libro.titulo = titulo
            libro.observaciones = observaciones
            libro.editorial = editorial
            await repo.save(libro)
            return res.status(HttpStatus.CREATED).json({ 
                success: true, 
                message: Message.LIBRO_ACTUALIZADO_CORRECTAMENTE
            })            
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message                 
            })            
        }
    }
}
import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import { Libro  } from '../entity/Libro'
import { Editorial  } from '../entity/Editorial'
import { Tema } from '../entity/Tema'
import { Idioma } from '../entity/Idioma'
import * as Message from '../messages'
import Util from '../util/Util'

export class LibrosController {
    static obtenerLibros = async (req: Request, res: Response) => {
        const { titulo, ordenar, editorial, tema, publicado } = req.query
        const librosRepository = getRepository(Libro) 

        const query = librosRepository
            .createQueryBuilder('libro')            
            .leftJoinAndSelect("libro.editorial", "editorial")
            .leftJoinAndSelect("libro.tema", "tema")

        if (titulo) {
            query.andWhere('libro.titulo LIKE :titulo', { titulo: `%${titulo}%` })
        }

        if (editorial) {
            query.andWhere('libro.editorial = :editorial', { editorial: `${editorial}` })
        }

        if (tema) {
            query.andWhere('libro.tema = :tema', { tema: `${tema}` })
        }

        if (publicado) {
            query.andWhere('libro.publicado = :publicado', { publicado: `${publicado}` })
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

    static contarLibros = async (req: Request, res: Response) => {
        const total = await getRepository(Libro).count()              

        return res.status(HttpStatus.OK).json({
            success: true,
            count: total
        })
    }

    static crearLibro = async (req: Request, res: Response) => {
        const { titulo, observaciones, editorial, paginas, tema, publicado, idioma } = req.body                         
        
        if (! await Util.ExisteEditorial(+editorial)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.EDITORIAL_NO_EXISTE 
            })
        }  
        
        if (! await Util.ExisteIdioma(+idioma)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.IDIOMA_NO_ENCONTRADO
            })
        }

        if (! await Util.ExisteTema(+tema)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.TEMA_NO_ENCONTRADO
            })
        }        
        
        if (publicado > Util.AñoActual()) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.LIBRO_PUBLICADO_INCORRECTO
            })
        }

        const libro = new Libro()
        libro.titulo = titulo
        libro.observaciones = observaciones
        libro.publicado = publicado
        libro.paginas = paginas
        libro.editorial = await getRepository(Editorial).findOne(editorial)
        libro.tema = await getRepository(Tema).findOne(tema)
        libro.idioma = await getRepository(Idioma).findOne(idioma)
        
        const errors = await validate(libro)
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Libro)             
        
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

    static obtenerLibro = async (req: Request, res: Response) => {
        const { id } = req.params                

        if (! await Util.ExisteLibro(+id)) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.LIBRO_NO_ENCONTRADO              
            })
        }        
        
        const query = getRepository(Libro)
            .createQueryBuilder('libro')            
            .leftJoinAndSelect("libro.editorial", "editorial")   
            .leftJoinAndSelect("libro.tema", "tema")   
            .leftJoinAndSelect("libro.idioma", "idioma")   
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

    static borrarLibro = async (req: Request, res: Response) => {
        const { id } = req.params            
        
        if (! await Util.ExisteLibro(+id)) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.LIBRO_NO_ENCONTRADO              
            })
        }

        try {
            await getRepository(Libro).delete(id)
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
        const { titulo, observaciones, editorial, idioma, tema, paginas, publicado } = req.body  

        if (! await Util.ExisteLibro(+id)) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.LIBRO_NO_ENCONTRADO              
            })
        }              

        if (! await Util.ExisteEditorial(+editorial) ) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.EDITORIAL_NO_EXISTE 
            })
        }

        if (! await Util.ExisteIdioma(+idioma)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.IDIOMA_NO_ENCONTRADO
            })
        }

        if (! await Util.ExisteTema(+tema)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.TEMA_NO_ENCONTRADO
            })
        }        
        
        if (publicado > Util.AñoActual()) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.LIBRO_PUBLICADO_INCORRECTO
            })
        }

        let libro = getRepository(Libro).create(req.body)
        
        const errors = await validate(libro)
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Libro)

        try {
            let libro = await repo.findOne(id)
            libro.titulo = titulo
            libro.observaciones = observaciones
            libro.editorial = editorial
            libro.paginas = paginas
            libro.publicado = publicado
            libro.idioma = idioma
            libro.tema = tema
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

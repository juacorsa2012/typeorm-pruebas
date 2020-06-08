import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import { Tutorial  } from '../entity/Tutorial'
import { Fabricante  } from '../entity/Fabricante'
import { Idioma  } from '../entity/Idioma'
import { Tema  } from '../entity/Tema'
import * as Message from '../messages'
import Util from '../util/Util'

export class TutorialesController {
    static obtenerTutoriales = async (req: Request, res: Response) => {
        const { titulo, ordenar, fabricante, idioma, tema } = req.query
        const repo = getRepository(Tutorial)

        const query = repo
            .createQueryBuilder('tutorial')            
            .leftJoinAndSelect("tutorial.fabricante", "fabricante")
            .leftJoinAndSelect("tutorial.tema", "tema")
            .leftJoinAndSelect("tutorial.idioma", "idioma")

        if (titulo) {
            query.andWhere('tutorial.titulo LIKE :titulo', { titulo: `%${titulo}%` })
        }

        if (fabricante) {
            query.andWhere('tutorial.fabricante = :fabricante', { fabricante: `${fabricante}` })
        }

        if (tema) {
            query.andWhere('tutorial.tema = :tema', { tema: `${tema}` })
        }

        if (idioma) {
            query.andWhere('tutorial.idioma = :idioma', { idioma: `${idioma}` })
        }
    
        if (ordenar) {            
            const direccion: string = ordenar.toString().split(':')[1].toUpperCase()
            if (direccion === 'DESC') {
                query.orderBy('tutorial.titulo', 'DESC')
            } else {
                query.orderBy('tutorial.titulo', 'ASC')
            }
        }           

        let tutoriales: any[]
        try {
            tutoriales = await query.getMany()    
            return res.status(HttpStatus.OK).json({ 
                success: true,
                count: tutoriales.length, 
                data: tutoriales 
            })    
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })                
        }        
    }

    static obtenerTutorial = async (req: Request, res: Response) => {
        const { id } = req.params                

        if (! await Util.ExisteTutorial(+id)) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TUTORIAL_NO_ENCONTRADO
            })
        }        
        
        const query = getRepository(Tutorial)
            .createQueryBuilder('tutorial')            
            .leftJoinAndSelect("tutorial.fabricante", "fabricante")            
            .leftJoinAndSelect("tutorial.tema", "tema")
            .leftJoinAndSelect("tutorial.idioma", "idioma")
            .where("tutorial.id = :id")
            .setParameter("id", id)        

        try {
            const tutorial = await query.getOne()
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                data: tutorial
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static crearTutorial = async (req: Request, res: Response) => {
        const { titulo, observaciones, fabricante, tema, idioma, publicado, duracion, actualizado } = req.body                         
               
        if (! await Util.ExisteFabricante(fabricante)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.FABRICANTE_NO_EXISTE
            })
        }        

        if (! await Util.ExisteTema(tema)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.TEMA_NO_ENCONTRADO
            })
        }   

        if (! await Util.ExisteIdioma(idioma)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.IDIOMA_NO_ENCONTRADO
            })
        }        

        const tutorial = new Tutorial
        tutorial.titulo = titulo
        tutorial.observaciones = observaciones
        tutorial.actualizado = actualizado
        tutorial.publicado = publicado
        tutorial.duracion = duracion
        tutorial.fabricante = await getRepository(Fabricante).findOne(fabricante)
        tutorial.tema = await getRepository(Tema).findOne(tema)
        tutorial.idioma = await getRepository(Idioma).findOne(idioma)
        
        const errors = await validate(tutorial)
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Tutorial)
        
        try {
            await repo.save(tutorial)
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                data: tutorial,
                message: Message.TUTORIAL_REGISTRADO_CORRECTAMENTE
            })
        } catch (e) {            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false,                 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message
            })
        }
    }

    static borrarTutorial = async (req: Request, res: Response) => {
        const { id } = req.params            
        
        if (! await Util.ExisteTutorial(+id)) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TUTORIAL_NO_ENCONTRADO
            })
        }

        try {
            await getRepository(Tutorial).delete(id)
            return res.status(HttpStatus.OK).json({ 
                success: true, 
                message: Message.TUTORIAL_BORRADO_CORRECTAMENTE
            })
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                success: false, 
                message: Message.IMPOSIBLE_COMPLETAR_ACCION,
                error: e.message                 
            })
        }
    }

    static contarTutoriales = async (req: Request, res: Response) => {
        const total = await getRepository(Tutorial).count()              

        return res.status(HttpStatus.OK).json({
            success: true,
            count: total
        })
    }

    static actualizarTutorial = async (req: Request, res: Response) => {
        const { id } = req.params             
        const { titulo, observaciones, fabricante, tema, idioma, publicado, duracion, actualizado } = req.body 

        if (! await Util.ExisteTutorial(+id)) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TUTORIAL_NO_ENCONTRADO
            })
        }     
        
        if (! await Util.ExisteFabricante(fabricante)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.FABRICANTE_NO_EXISTE
            })
        }

        let tutorial = getRepository(Tutorial).create(req.body)
        
        const errors = await validate(tutorial)
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Util.ObtenerMensajeError(errors)
            })
        }

        const repo = getRepository(Tutorial)

        try {
            let tutorial = await repo.findOne(id)
            tutorial.titulo = titulo
            tutorial.observaciones = observaciones
            tutorial.actualizado = actualizado
            tutorial.publicado = publicado
            tutorial.duracion = duracion
            tutorial.tema = tema
            tutorial.idioma = idioma
            tutorial.fabricante = fabricante
            await repo.save(tutorial)

            return res.status(HttpStatus.CREATED).json({ 
                success: true, 
                message: Message.TUTORIAL_ACTUALIZADO_CORRECTAMENTE
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




}
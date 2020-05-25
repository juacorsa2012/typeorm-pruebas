import { getRepository } from  'typeorm'
import { Request, Response } from 'express'
import { validate } from 'class-validator'
import * as HttpStatus from  'http-status-codes'
import { TutorialPendiente  } from '../entity/TutorialPendiente'
import { Fabricante  } from '../entity/Fabricante'
import * as Message from '../messages'

export class TutorialesPendientesController {
    static obtenerTutoriales = async (req: Request, res: Response) => {
        const { titulo, ordenar } = req.query
        const repo = getRepository(TutorialPendiente)

        const query = repo
            .createQueryBuilder('tutorial')            
            .leftJoinAndSelect("tutorial.fabricante", "fabricante")

        if (titulo) {
            query.andWhere('tutorial.titulo LIKE :titulo', { titulo: `%${titulo}%` })
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

        const existe = await TutorialesPendientesController.existeTutorial(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TUTORIAL_NO_ENCONTRADO
            })
        }        
        
        const query = getRepository(TutorialPendiente)
            .createQueryBuilder('tutorial')            
            .leftJoinAndSelect("tutorial.fabricante", "fabricante")            
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
        const { titulo, observaciones, fabricante } = req.body          
               
        // Validamos si la editorial existe
        const existe = await TutorialesPendientesController.existeFabricante(fabricante)

        if (!existe) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.FABRICANTE_NO_EXISTE
            })
        }        

        const tutorial = new TutorialPendiente
        tutorial.titulo = titulo
        tutorial.observaciones = observaciones
        tutorial.fabricante = await getRepository(Fabricante).findOne(fabricante)

        // Validamos el modelo
        const errors = await validate(tutorial, { validationError: { target: false } })
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: errors })
        }

        const repo = getRepository(TutorialPendiente)
        
        try {
            await repo.save(tutorial)
            res.status(HttpStatus.OK).json({ 
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
        
        const existe = await TutorialesPendientesController.existeTutorial(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TUTORIAL_NO_ENCONTRADO
            })
        }

        try {
            await getRepository(TutorialPendiente).delete(id)
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

    static actualizarTutorial = async (req: Request, res: Response) => {
        const { id } = req.params             
        
        let existe = await TutorialesPendientesController.existeTutorial(+id)

        if (!existe) {
            return res.status(HttpStatus.NOT_FOUND).json({ 
                success: false, 
                message: Message.TUTORIAL_NO_ENCONTRADO
            })
        }

        const { titulo, observaciones, fabricante } = req.body
        
        existe = await TutorialesPendientesController.existeFabricante(fabricante)     

        if (!existe) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: Message.FABRICANTE_NO_EXISTE
            })
        }

        let tutorial = getRepository(TutorialPendiente).create(req.body)

        // Validamos el modelo
        const errors = await validate(tutorial, { validationError: { target: false } })
        if (errors.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({ 
                success: false, 
                message: errors 
            })
        }

        const repo = getRepository(TutorialPendiente)

        try {
            let tutorial = await repo.findOne(id)
            tutorial.titulo = titulo
            tutorial.observaciones = observaciones
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

    private static existeFabricante = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Fabricante).findOneOrFail(id)    
            return true
        } catch (e) {
            return false
        }            
    }

    private static existeTutorial = async (id: number): Promise<boolean> => {
        try {
            await getRepository(TutorialPendiente).findOneOrFail(id)    
            return true
        } catch (e) {
            return false
        }            
     }
}

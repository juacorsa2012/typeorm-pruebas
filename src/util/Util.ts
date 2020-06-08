import { getRepository } from  'typeorm'
import { Tema } from '../entity/Tema'
import { Fabricante } from '../entity/Fabricante'
import { Editorial } from '../entity/Editorial'
import { Idioma } from '../entity/Idioma'
import { LibroPendiente } from '../entity/LibroPendiente'
import { TutorialPendiente } from '../entity/TutorialPendiente'
import { Libro } from '../entity/Libro'
import { Tutorial } from '../entity/Tutorial'
  
export default class Util {
    static ExisteTema = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Tema).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   
    
    static ExisteFabricante = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Fabricante).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static ExisteEditorial = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Editorial).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static ExisteIdioma = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Idioma).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static ExisteLibro = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Libro).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static ExisteLibroPendiente = async (id: number): Promise<boolean> => {
        try {
            await getRepository(LibroPendiente).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static ExisteTutorial = async (id: number): Promise<boolean> => {
        try {
            await getRepository(Tutorial).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static ExisteTutorialPendiente = async (id: number): Promise<boolean> => {
        try {
            await getRepository(TutorialPendiente).findOneOrFail(id)    
            return true
        } catch (e) {
            return false  
        }               
    }   

    static AñoActual = () => {
        return new Date().getFullYear()
    }

    static ObtenerMensajeError(errors: any): string {    
        if (errors[0].constraints['maxLength']) {
            return errors[0].constraints['maxLength']
        }
        else if (errors[0].constraints['isNotEmpty']) {
            return errors[0].constraints['isNotEmpty']
        } 
        else if (errors[0].constraints['isInt']) {
            return errors[0].constraints['isInt']
        }        
        else if (errors[0].constraints['min']) {
            return errors[0].constraints['min']
        }              
        else return 'Error de validación no contorlado'
    }     
}   
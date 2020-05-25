import { getRepository } from  'typeorm'
import { Tema } from '../entity/Tema';
import { Fabricante } from '../entity/Fabricante';
import { Editorial } from '../entity/Editorial';
  
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





    static ObtenerMensajeError(errors: any): string {    
        if (errors[0].constraints['maxLength']) {
            return errors[0].constraints['maxLength']
        }
        else if (errors[0].constraints['isNotEmpty']) {
            return errors[0].constraints['isNotEmpty']
        } else return ''

    }     
}   
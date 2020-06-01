import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { MaxLength, IsNotEmpty } from "class-validator";

@Entity('idiomas')
@Unique(['nombre'])
export class Idioma {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40, nullable: false })   
    @IsNotEmpty({ message: 'El nombre es un campo requerido' })       
    @MaxLength(40, { message: "El nombre debe tener como máximo $constraint1 caracteres" })
    nombre: string;
}

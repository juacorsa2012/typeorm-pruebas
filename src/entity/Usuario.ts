import {Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm";
import { IsNotEmpty, MaxLength } from "class-validator";

@Entity('usuarios')
@Unique(['email'])
export class Usuario {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })   
    @IsNotEmpty({ message: 'El usuario es un campo requerido' })       
    @MaxLength(255, { message: "El usuario debe tener como máximo $constraint1 caracteres" })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: false })   
    @IsNotEmpty({ message: 'El password es un campo requerido' })           
    password: string;

    @Column({ type: "varchar", length: 25, nullable: false })   
    @IsNotEmpty({ message: 'El rol es un campo requerido' })       
    rol: string
}

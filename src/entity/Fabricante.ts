import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany} from "typeorm";
import { MaxLength, IsNotEmpty } from "class-validator";
import { TutorialPendiente } from "./TutorialPendiente";

@Entity('fabricantes')
@Unique(['nombre'])
export class Fabricante {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40, nullable: false })   
    @IsNotEmpty({ message: 'El nombre es un campo requerido' })       
    @MaxLength(40, { message: "El nombre debe tener como máximo $constraint1 caracteres" })
    nombre: string;

    @OneToMany(() => TutorialPendiente, tutorial => tutorial.fabricante)
    tutoriales_pendientes: TutorialPendiente[]
}

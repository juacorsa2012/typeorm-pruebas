import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import { MaxLength, IsNotEmpty } from "class-validator";
import { Libro } from "./Libro";
import { Tutorial } from "./Tutorial";

@Entity('temas')
@Unique(['nombre'])
export class Tema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40, nullable: false })   
    @IsNotEmpty({ message: 'El nombre es un campo requerido' })       
    @MaxLength(40, { message: "El nombre debe tener como máximo $constraint1 caracteres" })
    nombre: string;

    @OneToMany(() => Libro, libro => libro.tema)
    libros: Libro[]

    @OneToMany(() => Tutorial, tutorial => tutorial.tema)
    tutoriales: Tutorial[]
}

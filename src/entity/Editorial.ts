import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany} from "typeorm";
import { MaxLength, IsNotEmpty } from "class-validator";
import { LibroPendiente } from "./LibroPendiente";
import { Libro } from "./Libro";

@Entity('editoriales')
@Unique(['nombre'])
export class Editorial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40, nullable: false })   
    @IsNotEmpty({ message: 'El nombre es un campo requerido' })       
    @MaxLength(40, { message: "El nombre debe tener como máximo $constraint1 caracteres" })
    nombre: string;

    @OneToMany(() => LibroPendiente, libro => libro.editorial)
    libros_pendientes: LibroPendiente[]

    @OneToMany(() => Libro, libro => libro.editorial)
    libros: Libro[]
}

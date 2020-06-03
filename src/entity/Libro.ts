import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import { MaxLength, IsNotEmpty } from "class-validator"
import { Editorial } from  "./Editorial"
import { Idioma } from "./Idioma";
import { Tema } from "./Tema";

@Entity('libros')
export class Libro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })   
    @IsNotEmpty({ message: 'El título es un campo requerido' })       
    @MaxLength(255, { message: "El título debe tener como máximo $constraint1 caracteres" })
    @Index()
    titulo: string;

    @Column({ type: "int", nullable: false })   
    @IsNotEmpty({ message: 'Las páginas es un campo requerido' })       
    paginas: number;

    @Column({ type: "int", nullable: false })   
    @IsNotEmpty({ message: 'El año de publicación es un campo requerido' })       
    publicado: number;

    @Column({ type: "text", nullable: true })
    observaciones: string;
        
    @ManyToOne(() => Editorial, editorial => editorial.libros)
    editorial: Editorial;
    
    @ManyToOne(() => Idioma, idioma => idioma.libros)
    idioma: Idioma;
    
    @ManyToOne(() => Tema, tema => tema.libros)
    tema: Tema;
}
import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import { MaxLength, IsNotEmpty } from "class-validator"
import { Fabricante } from  "./Fabricante"
import { Idioma } from "./Idioma";
import { Tema } from "./Tema";

@Entity('tutoriales')
export class Tutorial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })   
    @IsNotEmpty({ message: 'El título es un campo requerido' })       
    @MaxLength(255, { message: "El título debe tener como máximo $constraint1 caracteres" })
    @Index()
    titulo: string;

    @Column({ type: "int", nullable: false })   
    @IsNotEmpty({ message: 'La duración es un campo requerido' })       
    duracion: number;

    @Column({ type: "int", nullable: false })   
    @IsNotEmpty({ message: 'El año de publicación es un campo requerido' })       
    publicado: number;

    @Column({ type: "varchar", length: 20, nullable: true })   
    actualizado: string;

    @Column({ type: "text", nullable: true })
    observaciones: string;
        
    @ManyToOne(() => Fabricante, fabricante => fabricante.tutoriales_pendientes)
    fabricante: Fabricante;

    @ManyToOne(() => Idioma, idioma => idioma.tutoriales)
    idioma: Idioma;

    @ManyToOne(() => Tema, tema => tema.tutoriales)
    tema: Tema;
}
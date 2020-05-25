import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import { MaxLength, IsNotEmpty } from "class-validator"
import { Fabricante } from  "./Fabricante"

@Entity('tutoriales_pendientes')
export class TutorialPendiente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })   
    @IsNotEmpty({ message: 'El título es un campo requerido' })       
    @MaxLength(255, { message: "El nombre debe tener como máximo $constraint1 caracteres" })
    @Index()
    titulo: string;

    @Column({ type: "text", nullable: true })
    observaciones: string;
        
    @ManyToOne(() => Fabricante, fabricante => fabricante.tutoriales_pendientes)
    fabricante: Fabricante;
}


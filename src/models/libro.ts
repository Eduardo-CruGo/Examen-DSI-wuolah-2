import { Document, Schema, model } from 'mongoose';

import { ILector } from './lector.js'

const generos = ["ficción" , "no ficción", "historia", "aventura", "ciencia", "fantasía" , "biografía"]

interface IResenia {
    lector: ILector;
    calificacion: number;
    comentario: string;
}

const ReseniaSchema = new Schema<IResenia> ({
    lector: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Lector'
    },
    calificacion: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (!Number.isInteger(value) || value < 1 || value > 5) {
                throw new Error('La calificacion que ser un entero positivo entre 1 y 5')
            }
        }
    },
    comentario: {
        type: String,
        required: true,
        trim: true,
    }
})


export interface ILibro extends Document {
    titulo: string;
    autor: string;
    anio: number;
    editorial: string;
    n_paginas: number;
    genero: string[];
    resenias: IResenia[];
}

const LibroSchema = new Schema<ILibro>({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    autor: {
        type: String,
        required: true,
    },
    anio: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (!Number.isInteger(value) || value < 0) {
                throw new Error('El año tiene que ser un entero positivo')
            }
        }
    },
    editorial: {
        type: String,
        required: true,
    },
    n_paginas: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (!Number.isInteger(value) || value < 1) {
                throw new Error('El numero de paginas tiene que ser un entero positivo distinto de 0')
            }
        }        
    },
    genero: {
        type: [String],
        required: true,
        enum: generos,
    },
    resenias: {
        type: [ReseniaSchema],
        default: [],
    }
})

export const Libro = model<ILibro>('Libro', LibroSchema);
import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

const generos = ["ficción" , "no ficción", "historia", "aventura", "ciencia", "fantasía" , "biografía"]

export interface ILector extends Document {
    nombre: string;
    nombre_usr: string;
    mail: string;
    generos_fav: string[];
}

const LectorSchema = new Schema<ILector>({
    nombre: {
        type: String,
        required: true,
        trim: true,
        validate: (value: string) => {
            if (value.length < 3) {
                throw new Error('El nombre tiene que tener mas de 2 caracteres')
            }
        }
    },
    nombre_usr: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value: string) => {
            if (value.length < 3) {
                throw new Error('El nombre de usuario tiene que tener mas de 2 caracteres')
            }
        }        
    },
    mail: {
        type: String,
        required: true,
        unique: true,
        validate: (value: string) => {
            if (!validator.default.isEmail(value)) {
                throw new Error('El mail introducido no es valido')
            }
        }  
    },
    generos_fav: {
        type: [String],
        enum: generos,
    }

})

export const Lector = model<ILector>('Lector',LectorSchema)
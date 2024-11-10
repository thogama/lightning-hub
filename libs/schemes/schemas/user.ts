import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Contract } from './contract';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

    // Para login tradicional com username e senha
    @Prop({ required: false, unique: true })
    username?: string;  // Nome de usuário único, opcional para OAuth, obrigatório para login tradicional

    @Prop({ required: false })
    passwordHash?: string;  // Hash da senha, opcional para OAuth, obrigatório para login tradicional

    // Para login via OAuth (Google)
    @Prop({ required: false, unique: true })
    oauthId?: string;  // ID único fornecido pelo Google (ou outro provedor OAuth)

    @Prop({ required: false })
    provider?: string;  // Nome do provedor OAuth (por exemplo, 'google')

    @Prop({ required: false })
    email?: string;  // Opcional, pode ser fornecido pelo provedor OAuth


    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'contract' }] })
    contracts: Contract[]; 

}

export const UserSchema = SchemaFactory.createForClass(User);

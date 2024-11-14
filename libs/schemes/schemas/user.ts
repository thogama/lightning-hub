import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Contract } from './contract';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: false, unique: true })
    oauthId?: string; 

    @Prop({ required: false })
    provider?: string; 

    @Prop({ required: false, unique: true })
    email?: string;  

    @Prop({ required: false, unique: true })
    pubKey?: string; 

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
    contracts: Contract[];

    @Prop({ required: false })
    name?: string;

    @Prop({ required: false })
    avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

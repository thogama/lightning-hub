import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user';
import { Invoice } from './invoice';

export type ContractDocument = HydratedDocument<Contract>;

@Schema({ timestamps: true })
export class Contract {


    @Prop({ required: true })
    hash: String

    @Prop({ default: "active" })
    status: "active" | "completed" | "expired" | "canceled";

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    preImage: string;

    @Prop({ default: [] })
    participants: Invoice[]

}

export const ContractSchema = SchemaFactory.createForClass(Contract);

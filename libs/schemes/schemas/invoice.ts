import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Contract } from './contract';
import { User } from './user';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {

    @Prop({ required: true, unique: true })
    paymentRequest: string;

    @Prop({ required: true, ref: 'contract' })
    contract: Contract;

    @Prop({ required: true, ref: 'User' })
    author: User

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

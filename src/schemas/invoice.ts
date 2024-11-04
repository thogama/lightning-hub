import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {

    @Prop({ required: true })
    paymentRequest: string;

    @Prop({ required: true, type: Object })
    data: Object

    @Prop({ default: false })
    paid: boolean;

}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

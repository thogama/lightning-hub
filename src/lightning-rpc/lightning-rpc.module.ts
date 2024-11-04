import { Module } from '@nestjs/common';
import { LightningRpcService } from './lightning-rpc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from 'src/schemas/invoice';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'invoices', schema: InvoiceSchema }])],
    exports: [LightningRpcService],
    providers: [LightningRpcService],
})
export class LightningRpcModule { }

import { Module } from '@nestjs/common';
import { LightningRpcService } from './lightning-rpc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from 'src/schemas/invoice';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'invoices', schema: InvoiceSchema }]), ConfigModule],
    exports: [LightningRpcService],
    providers: [LightningRpcService],
})
export class LightningRpcModule { }

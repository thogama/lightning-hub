import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from '../schemas/contract';
import { Invoice, InvoiceSchema } from '../schemas/invoice';
import {  UserSchema } from '../schemas/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'contracts', schema: ContractSchema },
      { name: 'invoices', schema: InvoiceSchema }, // Exemplo de outros schemas
    ]),

  ],
  exports: [MongooseModule.forFeature([
    { name: 'users', schema: UserSchema },
    { name: 'contracts', schema: ContractSchema },
    { name: 'invoices', schema: InvoiceSchema }, // Exemplo de outros schemas
  ]),],
})
export class SchemesModule { }

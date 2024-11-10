import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LightningRpcModule } from '../lightning-rpc/lightning-rpc.module';
import { SchemesModule } from '@app/schemes';

@Module({
  providers: [ContractsService],
  controllers: [ContractsController],
  exports: [ContractsService],
  imports: [LightningRpcModule, SchemesModule
  ]
})
export class ContractsModule { }

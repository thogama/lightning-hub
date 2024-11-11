import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { LightningRpcModule } from '@app/lightning-rpc/lightning-rpc.module';
import { SchemesModule } from '@app/schemes';

@Module({
  providers: [ContractsService],
  controllers: [ContractsController],
  exports: [ContractsService],
  imports: [LightningRpcModule, SchemesModule
  ]
})
export class ContractsModule { }

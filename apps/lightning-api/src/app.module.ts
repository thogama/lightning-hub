import { Module } from '@nestjs/common';
import { LightningRpcModule } from '@app/lightning-rpc/lightning-rpc.module';
import { LndModule } from './lnd/lnd.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { WalletModule } from './wallet/wallet.module';
import { WalletController } from './wallet/wallet.controller';
import { ContractsModule } from './contracts/contracts.module';
import { ContractsController } from './contracts/contracts.controller';
import { SchemesModule } from '@app/schemes';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_GUARD } from '@nestjs/core';
import { AuthApiGuard } from './guards/auth.guard';
@Module({
  imports: [
    LightningRpcModule,
    LndModule, ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: "lightning-api" }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
      },
    ]),
    SchemesModule,
    WalletModule,
    ContractsModule,
  ],
  controllers: [WalletController, ContractsController],
  providers: [
    {
      provide: APP_GUARD, // Registra o guard global
      useClass: AuthApiGuard, // O guard que valida o token
    },
  ]

})
export class AppModule {

}

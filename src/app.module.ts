import { Module } from '@nestjs/common';
import { LightningRpcModule } from './lightning-rpc/lightning-rpc.module';
import { LightningRpcController } from './lightning-rpc/lightning-rpc.controller';
import { LndModule } from './lnd/lnd.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletModule } from './wallet/wallet.module';
import { WalletController } from './wallet/wallet.controller';

@Module({
  imports: [
    LightningRpcModule,
    LndModule, ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: "dev" }),
    WalletModule
  ],
  controllers: [LightningRpcController, WalletController],

})
export class AppModule {

}

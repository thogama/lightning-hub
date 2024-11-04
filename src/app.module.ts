import { Module } from '@nestjs/common';
import { LightningRpcModule } from './lightning-rpc/lightning-rpc.module';
import { LightningRpcController } from './lightning-rpc/lightning-rpc.controller';
import { LndModule } from './lnd/lnd.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    LightningRpcModule,
    LndModule, ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: "dev" })
  ],
  controllers: [LightningRpcController],

})
export class AppModule {

}

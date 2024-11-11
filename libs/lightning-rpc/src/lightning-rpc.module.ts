import { Module } from '@nestjs/common';
import { LightningRpcService } from './lightning-rpc.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    exports: [LightningRpcService],
    providers: [LightningRpcService],
})
export class LightningRpcModule { }

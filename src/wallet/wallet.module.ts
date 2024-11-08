import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { LightningRpcModule } from 'src/lightning-rpc/lightning-rpc.module';

@Module({
    imports: [LightningRpcModule],
    exports: [WalletService],
    providers: [WalletService],
})
export class WalletModule { }

import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { LightningRpcModule } from '@app/lightning-rpc/lightning-rpc.module';

@Module({
    imports: [LightningRpcModule],
    exports: [WalletService],
    providers: [WalletService],
})
export class WalletModule { }

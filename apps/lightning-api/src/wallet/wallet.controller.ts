import { Controller, Get, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthApiGuard } from '../guards/auth.guard';


@Controller("wallet")
@UseGuards(AuthApiGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) {

    }

    @Get('balance')
    async getBalance(): Promise<any> {
        const data = await this.walletService.getBalance();
        return data;
    }


    @Get('deposit')
    async newAddress(): Promise<any> {
        const data = await this.walletService.newAddress();
        return data;
    }

}

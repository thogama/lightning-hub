import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';


@Controller("wallet")
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

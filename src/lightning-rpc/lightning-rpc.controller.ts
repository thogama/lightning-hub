import { Body, Controller, Get, Post } from '@nestjs/common';
import { LightningRpcService } from "./lightning-rpc.service";

@Controller("invoice")
export class LightningRpcController {
    constructor(private readonly lightninRpc: LightningRpcService) { }

    @Get()
    async getInfo(): Promise<any> {
        const data = await this.lightninRpc.getNodeInfo();
        return data;
    }
    @Get("all")
    async getInvocies(): Promise<any> {
        const data = await this.lightninRpc.allInvoices();
        return data;
    }

    @Post()
    async createInvoice(@Body() body: { value: number, memo: string }): Promise<any> {
        const data = await this.lightninRpc.createInvoice(body.value, body.memo);
        return data;
    }
    @Post("pay")
    async payInvoice(@Body() body: { payReq: string, amount: number }): Promise<any> {
        const data = await this.lightninRpc.payInvoice(body.payReq, body.amount);
        return data;
    }
    @Get("payments")
    async getPayments(): Promise<any> {
        const data = await this.lightninRpc.allPayments();
        return data;
    }

    @Post("fund")
    async fundWallet(@Body() body: { amount: number }): Promise<any> {
        const data = await this.lightninRpc.fundWallet(body.amount);
        return data;
    }
}

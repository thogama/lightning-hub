import { Injectable, OnModuleInit } from "@nestjs/common";
import { LightningRpcService } from "../lightning-rpc/lightning-rpc.service";

@Injectable()
export class WalletService implements OnModuleInit {
    constructor(private readonly lightninRpc: LightningRpcService) {
        this.client = this.lightninRpc.getClient();
    }
    private client: any;

    onModuleInit() {
        this.client = this.lightninRpc.getClient();
    }


    async getBalance(): Promise<any> {
        const data = new Promise((resolve, reject) => {
            this.client.walletBalance({}, (error, response) => {
                if (error) {
                    return reject(error);
                }
                resolve(response);
            });
        })
        return data;
    }
    async newAddress() {
        return new Promise((resolve, reject) => {
            this.client.newAddress({ type: "0" }, (error, response) => {
                if (error) {
                    return reject(error);
                }
                resolve(response.address);
            });
        });
    }
}
    
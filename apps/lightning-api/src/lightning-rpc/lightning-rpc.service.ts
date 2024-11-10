import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LightningRpcService implements OnModuleInit {
    private client: any;

    constructor(
        
        private readonly configService: ConfigService,
    ) { }


    onModuleInit() {
        const packageDefinition = protoLoader.loadSync("apps/lightning-api/src/lightning-rpc/lightning.proto", {
            keepCase: true,
            longs: String,
            defaults: true,
            oneofs: true,
        });
        try{

            const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;
            
            const tlsCertPath = this.configService.get<string>('LND_TLS_PATH');
            const macaroonPath = this.configService.get<string>('LND_MACAROON_PATH');
            
            const macaroon = fs.readFileSync(macaroonPath).toString('hex');
            const macaroonCreds = grpc.credentials.createFromMetadataGenerator((args, callback) => {
                const metadata = new grpc.Metadata();
                metadata.add('macaroon', macaroon);
                callback(null, metadata);
            });
            const grpcCreds = grpc.credentials.createSsl(fs.readFileSync(tlsCertPath));
            const creds = grpc.credentials.combineChannelCredentials(grpcCreds, macaroonCreds);
            // @ts-ignore
            this.client = new lnrpc.Lightning('localhost:10009', creds);
        } catch (err) {
            Logger.error("Error initializing Lightning RPC client", err);
            
        }

    }

    public getClient(): any {
        return this.client;
    }

    getNodeInfo() {
        return new Promise((resolve, reject) => {
            this.client.GetInfo({}, (error, response) => {
                if (error) {
                    return reject(error);
                }
                resolve(response);
            });
        });
    }


    
    

    


}

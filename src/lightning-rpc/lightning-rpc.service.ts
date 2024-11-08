import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as fs from 'fs';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Invoice } from 'src/schemas/invoice';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LightningRpcService implements OnModuleInit {
    private client: any;

    constructor(
        @InjectModel('invoices') private readonly invoiceModel: Model<Invoice>,
        private readonly configService: ConfigService,
    ) { }


    onModuleInit() {
        const packageDefinition = protoLoader.loadSync("src/lightning-rpc/lightning.proto", {
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

    async createInvoice(value: number, memo: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const request = { value, memo };
            this.client.AddInvoice(request, async (error, response) => {
                if (error) {
                    console.error("Error creating invoice:", error);
                    return reject(error);
                }


                const newInvoice = new this.invoiceModel({
                    paymentRequest: response.payment_request,
                    data: {

                    }

                });

                try {

                    await newInvoice.save();
                    resolve(response.payment_request); // Retornando o payment_request
                } catch (dbError) {
                    console.error("Error saving invoice to MongoDB:", dbError);
                    reject(dbError);
                }
            });
        });
    }

    async allInvoices() {
        try {
            const invoices = await this.invoiceModel.find().exec();

            const paymentRequests = invoices.map(invoice => invoice.paymentRequest);

            const decodedInvoices = await Promise.all(paymentRequests.map(async (payReq) => {
                return new Promise((resolve, reject) => {
                    this.client.decodePayReq({ pay_req: payReq }, (error, response) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(response);
                    });
                });
            }));

            return decodedInvoices;
        } catch (err) {
            console.error("Error fetching invoices:", err);
            throw err;
        }
    }

    async payInvoice(payment_request: string, amount: number) {
        const invoice = await this.invoiceModel.findOne({ paymentRequest: payment_request }).exec();
        if (!invoice) {
            throw new Error("Invoice não encontrado");
        }

        return new Promise((resolve, reject) => {
            // Enviar pagamento com parâmetros ajustados
            const call = this.client.sendPayment({
                payment_request: payment_request,
                fee_limit_msat: 1000, // Exemplo de limite de taxa de pagamento
                amt: amount, // Defina o valor do pagamento
                allow_self_payment: true,
            });

            // Escutando o evento de dados (dados da resposta)
            call.on('data', (response: any) => {
                console.log("Resposta de pagamento:", response);
                if (response.payment_error) {
                    // Caso ocorra erro no pagamento
                    return reject(new Error(`Erro de pagamento: ${response.payment_error}`));
                }
            });

            // Escutando o status final da transação
            call.on('status', (status: any) => {
                console.log("Status final do pagamento:", status);
            });

            // Escutando quando o stream de pagamento é encerrado
            call.on('end', () => {
                console.log("Stream de pagamento encerrado.");
                resolve("Pagamento finalizado com sucesso.");
            });

            // Escutando erro durante o pagamento
            call.on('error', (err: any) => {
                console.error("Erro durante o pagamento:", err.message);
                reject(new Error(`Erro durante o pagamento: ${err.message}`));
            });

            // Envia a solicitação de pagamento
            call.write({
                payment_request: payment_request,
                fee_limit_msat: 1000, // Taxa limite em msat
                amt: amount,
                allow_self_payment: true, // Permitir pagamento para si mesmo
            });

            // Encerra o stream depois de enviar o pedido
            call.end();
        });
    }



    async allPayments() {
        this.client.listPayments({ include_incomplete: true }, (error, response) => {
            if (error) {
                console.error("Error fetching payments:", error);
                throw error;
            }
            return response;
        })
    }



}

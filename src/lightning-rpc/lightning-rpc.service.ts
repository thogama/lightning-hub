import { Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as fs from 'fs';
import * as path from 'path';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Invoice } from 'src/schemas/invoice';

@Injectable()
export class LightningRpcService {
    private client: any;

    constructor(
        @InjectModel('invoices') private readonly invoiceModel: Model<Invoice>,
    ) {

        const packageDefinition = protoLoader.loadSync("src/lightning-rpc/lightning.proto", {
            keepCase: true,
            longs: String,
            defaults: true,
            oneofs: true,
        });

        const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;

        const tlsCertPath = path.join(process.env.HOME, 'AppData', 'Local', 'Lnd', 'tls.cert');
        const macaroonPath = path.join(process.env.HOME, 'AppData', 'Local', 'Lnd', 'data', 'chain', 'bitcoin', 'testnet', 'admin.macaroon');

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

        let call = this.client.sendPayment({
            payment_request: payment_request,
            fee_limit_msat: 0,
            amount_msat: amount,
            allow_self_payment: true,
        });

        call.on('data', function (response) {
            console.log("Resposta de pagamento:", response);
        });

        call.on('status', function (status) {
            console.log("Status final do pagamento:", status);
        });

        call.on('end', function () {
            console.log("Stream de pagamento encerrado.");
        });

        call.on('error', function (err) {
            console.error("Erro durante o pagamento:", err.message);
        });

        call.write({
            payment_request: payment_request,
            fee_limit_msat: 0,
            amount_msat: amount,
            allow_self_payment: true,
        });

        // Encerra o stream depois de enviar o pedido
        call.end();
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

    async fundWallet(amount: number) {
        this.client.fundWallet({ include_incomplete: true }, (error, response) => {
            if (error) {
                console.error("Error fetching payments:", error);
                throw error;
            }
            return response;
        })
    }
}

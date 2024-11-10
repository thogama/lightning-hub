import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, createHash } from 'crypto';
import { Model } from 'mongoose';
import { LightningRpcService } from '../lightning-rpc/lightning-rpc.service';
import { ContractDocument } from 'libs/schemes/schemas/contract';
import { InvoiceDocument } from 'libs/schemes/schemas/invoice';

@Injectable()
export class ContractsService {
    constructor(
        @InjectModel('contracts') private contractModel: Model<ContractDocument>,
        @InjectModel('invoices') private invoiceModel: Model<InvoiceDocument>,
       
        private readonly lightninRpc: LightningRpcService,

    ) { }


    private client: any;

    onModuleInit() {
        this.client = this.lightninRpc.getClient();

    }
    async create(description: string, value: number) {
        const preImage = randomBytes(32).toString('hex');
        const hash = createHash('sha256').update(preImage).digest('hex');

        const authorInvoiceLn: any = await new Promise((resolve, reject) => {
            this.client.AddInvoice({
                memo: description,
                value: value,
                r_hash: Buffer.from(hash, 'hex'),
            }, (error, response) => {
                if (error) {
                    Logger.error("Error creating invoice:", error, 'ContractsService');
                    return reject(error);
                }
                resolve(response);
            });
        });

        const contractDb = new this.contractModel({
            preImage: preImage,
            hash: hash,
            description: description,
        })

        const authorInvoiceDb = new this.invoiceModel({
            paymentRequest: authorInvoiceLn.payment_request,
            author: "",
            contract: contractDb._id,
        });


        // return this.contractsService.create();
    }

    details(hash: string) {
        return this.contractModel.findOne({ hash: hash });

    }
}

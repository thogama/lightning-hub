import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { LightningRpcService } from '@app/lightning-rpc/lightning-rpc.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'libs/schemes/schemas/user';
import { Model } from 'mongoose';

@Injectable()
export class LightningStrategy extends PassportStrategy(Strategy, 'lightning') {
    constructor(
        private readonly lightningRpcService: LightningRpcService,
        @InjectModel('users') private userModel: Model<UserDocument>,
    ) {
        super();
        this.client = this.lightningRpcService.getClient();
    }

    private client: any;

 

    async validate(req: Request): Promise<any> {
        // Extrair assinatura, nonce e publicKey da requisição
        const { signature, nonce, publicKey } = req.body;

        if (!signature || !nonce || !publicKey) {
            throw new UnauthorizedException('Dados de autenticação incompletos');
        }

        // Verificar a assinatura usando o serviço de LND
        const isValid = await this.client.verifySignature({
            signature,
            nonce,
            publicKey,
        });

        if (!isValid) {
            throw new UnauthorizedException('Assinatura inválida');
        }

        // Obter ou criar o usuário associado à chave pública
        let user = await this.userModel.find({
            publicKey,
        });
        if (!user) {
            // user = await this.usersService.createUserWithPublicKey(publicKey);
        }

        // Retornar o usuário autenticado para o Passport
        return user;
    }
}

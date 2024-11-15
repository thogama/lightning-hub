import { Strategy, VerifyCallback } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { LightningRpcService } from '@app/lightning-rpc/lightning-rpc.service';

@Injectable()
export class LightningStrategy extends PassportStrategy(Strategy, 'lightning') {
    constructor(
        private readonly lightningRpcService: LightningRpcService,
    ) {
        super();

    }



    async validate(req: Request, done: VerifyCallback): Promise<any> {
        // Extrair os dados de autenticação da requisição
        const { nonce, signature } = req.body;

        // Verificar se todos os dados estão presentes
        if (!signature || !nonce) {
            throw new UnauthorizedException('Dados de autenticação incompletos');
        }

        const response = await this.lightningRpcService.verifySignature({ signature, nonce });
        done(null, response as any);
    }
}

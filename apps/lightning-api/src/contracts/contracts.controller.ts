import { Controller, Get, Logger, OnModuleInit, Param, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {

    constructor(
        private readonly contractsService: ContractsService) {

    }


    @Post('create')
    async create(description: string, value: number) {

    }

    @Get(':hash')
    details(@Param('hash') paymentRequest: string) {
        return this.contractsService.details(paymentRequest);
    }
}

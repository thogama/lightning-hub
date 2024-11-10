import { Module } from '@nestjs/common';
import { LndService } from './lnd.service';
import { ConfigModule } from '@nestjs/config';


@Module({
    exports: [LndService],
    providers: [LndService],
    imports: []
})
export class LndModule { }

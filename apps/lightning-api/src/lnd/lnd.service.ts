import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class LndService implements OnModuleInit {


    constructor() { }

    onModuleInit() {
        Logger.log('Starting LND','LND');

        this.setup();
    }

    setup() {
        const lndProcess = exec(`lnd --wallet-unlock-password-file=${path.join(process.env.HOME,"password.txt")}`, { cwd: process.env.HOME });

        // lndProcess.stdout.on('data', (data) => {
        //     console.log(data);
        // });

        lndProcess.stderr.on('data', (data) => {
            Logger.error(`${data}`,'LND');
        });

        lndProcess.on('exit', (code) => {
            Logger.error(`process exited with code ${code}`,'LND');
        });
        Logger.log('LND Started','LND');

    }
}

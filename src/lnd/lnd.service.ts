import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class LndService implements OnModuleInit {


    constructor() { }

    onModuleInit() {
        console.log('[LND] Module Initializing');

        this.setup();
    }

    setup() {
        const lndProcess = exec(`lnd --wallet-unlock-password-file=${path.join(process.env.HOME,"password.txt")}`, { cwd: process.env.HOME });

        // lndProcess.stdout.on('data', (data) => {
        //     console.log(data);
        // });

        lndProcess.stderr.on('data', (data) => {
            console.error(data);
        });

        lndProcess.on('exit', (code) => {
            console.log(`[LND] process exited with code ${code}`);
        });
        console.log('[LND] Setup Complete');

    }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'libs/schemes/schemas/user';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel('users') private userModel: Model<UserDocument>,
        private jwtService: JwtService) {

    }

    async createUserOnFirstLoginGoogle(user: any) {
        const profile = user.profile;
        const existingUser = await this.userModel.findOne({ email: profile.emails[0].value });
        if (!existingUser) {
            const newUser = new this.userModel({
                email: profile.emails[0].value,
                oauthId: profile.id,
                name: profile.displayName,
                provider: profile.provider,
                avatarUrl: profile.photos[0].value
            })
            await newUser.save();
        }

        const accessToken = this.jwtService.sign(profile, { secret: process.env.JWT_SECRET });
        const refreshToken = this.jwtService.sign(profile, { secret: process.env.JWT_SECRET, expiresIn: '7d' });

        return { accessToken, refreshToken }
    }

    async createUserOnFirstLoginLightning(user: any) {
        if (user.valid) {

            const existingUser = await this.userModel.findOne({ pubKey: user.publicKey });
            if (!existingUser) {
                const newUser = new this.userModel({
                    pubKey: user.publicKey,
                })
                await newUser.save();
            }
            const accessToken = this.jwtService.sign({ publicKey: user.publicKey }, { secret: process.env.JWT_SECRET });
            const refreshToken = this.jwtService.sign({ publicKey: user.publicKey }, { secret: process.env.JWT_SECRET });
            return {
                accessToken,
                refreshToken
            }
        } else {
            return { error: 'Invalid signature' }
        }
    }

}

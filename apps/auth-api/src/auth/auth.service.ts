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
        const refreshToken = this.jwtService.sign(profile, { secret: process.env.JWT_SECRET, expiresIn: '7d' });

        if (!existingUser) {
            const newUser = new this.userModel({
                email: profile.emails[0].value,
                oauthId: profile.id,
                name: profile.displayName,
                provider: profile.provider,
                avatarUrl: profile.photos[0].value
            })
            await newUser.save();
        } else {
            existingUser.refreshToken = refreshToken
            await existingUser.save()
        }

        const accessToken = this.jwtService.sign(profile, { secret: process.env.JWT_SECRET });

        return { accessToken }
    }

    async createUserOnFirstLoginLightning(payload: any) {
        if (payload.valid) {

            const existingUser = await this.userModel.findOne({ pubKey: payload.publicKey });
            const refreshToken = this.jwtService.sign({ publicKey: payload.publicKey }, { secret: process.env.JWT_SECRET });

            if (!existingUser) {
                const newUser = new this.userModel({
                    pubKey: payload.publicKey,
                    refreshToken: refreshToken
                })
                await newUser.save();

            } else {
                existingUser.refreshToken = refreshToken
                await existingUser.save();
            }
            const accessToken = this.jwtService.sign({ publicKey: payload.publicKey }, { secret: process.env.JWT_SECRET });
            return {
                accessToken
            }
        } else {
            return { error: 'Invalid signature' }
        }
    }
    async refreshToken(payload: any) {
        const refreshToken = payload.refreshToken;
        if (!refreshToken) {
            return { error: 'No refresh token provided' };
        }
        try {
            const user = await this.userModel.findOne({ refreshToken }).exec();

            if (!user) {
                return { error: 'Invalid refresh token' };
            }

            const decoded = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });

            const accessToken = this.jwtService.sign({ publicKey: decoded.publicKey }, { secret: process.env.JWT_SECRET });

            const newRefreshToken = this.jwtService.sign({ publicKey: decoded.publicKey }, { secret: process.env.JWT_SECRET });

            if (decoded.provider == "lightning") {
                await this.userModel.findOneAndUpdate({ pubKey: decoded.publicKey }, { refreshToken: newRefreshToken }).exec();
            } else {
                await this.userModel.findOneAndUpdate({ email: decoded.emails[0].value }, { refreshToken: newRefreshToken }).exec();
            }

            return { accessToken };
        } catch (error) {
            return { error: 'Invalid refresh token' };
        }
    }

    async validateToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            return { valid: true, user: decoded };
        } catch (error) {
            return { valid: false };
        }
    }

}

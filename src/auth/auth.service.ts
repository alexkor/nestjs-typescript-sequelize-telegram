
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from "crypto-js";
import { JwtService } from '@nestjs/jwt';
import { ScriptSignInUserDto } from './dto/ScriptSignInUserDto';
import { ButtonSignInUserDto } from './dto/ButtonSignInUserDto';

@Injectable()
export class AuthService {

    private readonly TELEGRAM_BOT_TOKEN;
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService) {
        this.TELEGRAM_BOT_TOKEN = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    }

    async ScriptSignIn(userDto: ScriptSignInUserDto): Promise<{ access_token: string }> {
        let dataToCheck = this.PrepareDataForHash(userDto);
        const secret = CryptoJS.HmacSHA256(this.TELEGRAM_BOT_TOKEN, "WebAppData");
        this.ValidateHash(dataToCheck, secret, userDto);
        const user = JSON.parse(userDto.user);
        return { access_token: await this.SignPayload(user) }
    }

    async ButtonSignIn(userDto: ButtonSignInUserDto): Promise<{ access_token: string }> {
        let dataToCheck = this.PrepareDataForHash(userDto);
        const secret = CryptoJS.SHA256(this.TELEGRAM_BOT_TOKEN);
        this.ValidateHash(dataToCheck, secret, userDto);
        return { access_token: await this.SignPayload(userDto) }
    }

    private SignPayload(userDto: Record<string, any>) {
        const payload = { sub: userDto.id, first_name: userDto.first_name, last_name: userDto.last_name };
        return this.jwtService.signAsync(payload);
    }

    private PrepareDataForHash(userDto: Record<string, any>) {
        if (!userDto.hash) {
            throw new UnauthorizedException();
        }

        const initData = new URLSearchParams(userDto as Record<string, any>);
        let dataToCheck = [];

        initData.sort();
        initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));
        return dataToCheck;
    }

    private ValidateHash(dataToCheck: any[], secret: any, userDto: Record<string, any>) {
        const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

        if (userDto.hash !== _hash) {
            throw new UnauthorizedException();
        }
    }
}

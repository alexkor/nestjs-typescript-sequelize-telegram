
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
        if (!userDto.hash) {
            throw new UnauthorizedException();
        }

        const initData = new URLSearchParams(userDto as Record<string, any>);
        let dataToCheck = [];

        initData.sort();
        initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));

        const secret = CryptoJS.HmacSHA256(this.TELEGRAM_BOT_TOKEN, "WebAppData");
        const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

        if (userDto.hash !== _hash) {
            throw new UnauthorizedException();
        }
        const user = JSON.parse(userDto.user);
        const payload = { sub: user.id, first_name: user.first_name, last_name: user.last_name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async ButtonSignIn(userDto: ButtonSignInUserDto): Promise<{ access_token: string }> {
        if (!userDto.hash) {
            throw new UnauthorizedException();
        }

        const initData = new URLSearchParams(userDto as Record<string, any>);
        let dataToCheck = [];

        initData.sort();
        initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));

        const secret = CryptoJS.SHA256(this.TELEGRAM_BOT_TOKEN);
        const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

        if (userDto.hash !== _hash) {
            throw new UnauthorizedException();
        }
        const payload = { sub: userDto.id, first_name: userDto.first_name, last_name: userDto.last_name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}

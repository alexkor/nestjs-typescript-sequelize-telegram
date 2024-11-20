
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from "crypto-js";

@Injectable()
export class AuthService {

    private TELEGRAM_BOT_TOKEN;
    constructor(private usersService: UsersService, private configService: ConfigService) {
        this.TELEGRAM_BOT_TOKEN = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    }

    async ScriptSignIn(query: string): Promise<any> {

        const TELEGRAM_BOT_TOKEN = this.TELEGRAM_BOT_TOKEN;
        const initData = new URLSearchParams(query);
        const hash = initData.get("hash");
        if (!hash) {
            throw new UnauthorizedException();
        }

        let dataToCheck = [];

        initData.sort();
        initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));

        const secret = CryptoJS.HmacSHA256(TELEGRAM_BOT_TOKEN, "WebAppData");
        const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

        if (hash !== _hash) {
            throw new UnauthorizedException();
        }
        const user = JSON.parse(initData.get("user"))
        return await this.usersService.findOne(user.id)
    }

    async ButtonSignIn(query: string): Promise<any> {
        //?id={{userId}}&first_name={{alex}}&last_name={{kor}}&user_name={{alexkor}}&photo_url={{filename}}&auth_date=1732095662&hash={{hash}}
        const TELEGRAM_BOT_TOKEN = this.TELEGRAM_BOT_TOKEN;
        const initData = new URLSearchParams(query);
        const hash = initData.get("hash");
        if (!hash) {
            throw new UnauthorizedException();
        }

        let dataToCheck = [];

        initData.sort();
        initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));

        const secret = CryptoJS.SHA256(TELEGRAM_BOT_TOKEN);
        const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

        if (hash !== _hash) {
            throw new UnauthorizedException();
        }
        const user = JSON.parse(initData.get("user"))
        return await this.usersService.findOne(user.id)
    }
}

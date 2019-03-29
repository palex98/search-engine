import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from '../auth.service';
import { UserRepository } from '../../../../repositories/user.repository';
const mongoose = require('mongoose');
import { ConfigService } from '../../config/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        @Inject(ConfigService) private readonly configService: ConfigService) {
        super(configService.get('google'));
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done) {
        try {
            const repo = new UserRepository(mongoose, 'User');
            repo.insertOrUpdateUser(profile);
            const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
            const user = {
                jwt,
            };
            done(null, user);
        } catch (err) {
            // console.log(err)
            done(err, false);
        }
    }

}

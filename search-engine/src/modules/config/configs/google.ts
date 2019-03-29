import { googleRoutes } from '../google.routes';

module.exports = {
  clientID    : `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL : `${process.env.BASE_URL}${googleRoutes.callback}`,
  passReqToCallback: true,
  scope: ['profile'],
  // session: true,
  // state: true,
};

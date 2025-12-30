import bcryptjs from 'bcryptjs';
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../modules/user/user.model';
import { Role, Status } from '../modules/user/user.interface';
import { envVars } from './envVars';
import { OTPService } from '../modules/otp/otp.service';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        console.log('Local Strategy called for email:', email);
        const isUserExist = await User.findOne({ email: email.trim() });
        console.log(isUserExist);
        if (!isUserExist) {
          return done(null, false, { message: 'User does not exist' });
        }

        if (!isUserExist.isVerified) {
          await OTPService.sendOTP(isUserExist.email, isUserExist.name);
          return done(null, false, {
            message: `User is not verified.email:${isUserExist.email}.name:${isUserExist.name}`,
          });
        }

        if (isUserExist.status === Status.SUSPENDED) {
          return done(null, false, {
            message: `User is ${isUserExist.status}`,
          });
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == 'google'
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              'You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.',
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: 'Invalid Credential' });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: 'No email found' });
        }

        let isUserExist = await User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: 'User is not verified' });
        }

        if (isUserExist && isUserExist.status === Status.SUSPENDED) {
          return done(null, false, {
            message: `User is ${isUserExist.status}`,
          });
        }

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            role: Role.USER,
            isVerified: true,
            picture:
              profile.photos && profile.photos[0] && profile.photos[0].value
                ? profile.photos[0].value
                : undefined,
            auths: [
              {
                provider: 'google',
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log('Google Strategy Error', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});

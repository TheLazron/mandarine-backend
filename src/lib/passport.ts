import exp from "constants";
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "881640054282-cir32cl5upgtkj0gab762ssr30h2ffeh.apps.googleusercontent.com",
      clientSecret: "GOCSPX - Zww7JEGeh5jpXefIKzTG4ViX4jhQ",
      callbackURL: "http://localhost:3010/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("User Signed In With Google");

      console.log("access token from Google", accessToken);
      console.log("RefreshToken", refreshToken);
      console.log("user profile:", profile);
      console.log("wth is done?", done);

      // The user has been successfully authenticated
      // You can perform additional actions here, such as creating a user account or storing the user's information

      // Call the done() callback to complete the authentication process
      return done(null, profile);
    }
  )
);

export default passport;

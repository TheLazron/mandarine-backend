// import { verify } from "crypto";
// import passport from "passport";

// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "http://localhost:3010/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log("User Signed In With Google");

//       console.log("access token from Google", accessToken);
//       console.log("RefreshToken", refreshToken);
//       console.log("user profile:", profile);
//       console.log("wth is done?", done);

//       // The user has been successfully authenticated
//       // You can perform additional actions here, such as creating a user account or storing the user's information

//       // Call the done() callback to complete the authentication process
//       return done(null, profile);
//     }
//   )
// );
// import passport from "../lib/passport.js";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Route for initiating the Google OAuth 2.0 authentication flow
// export const googleAuth = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// // Route for handling the Google OAuth 2.0 callback
// export const googleAuthCallback = passport.authenticate(
//   "google",
//   { failureRedirect: "/login" },
//   (req: Request, res: Response) => {
//     // Redirect or respond with a success message
//     res.json({ message: "Signed in successfully" });
//   }
// );

// // Custom middleware to check if the user is authenticated
// export function isAuthenticated(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.isAuthenticated()) {
//     return next();
//   }

//   // Redirect the user to the login page if not authenticated
//   res.json({ isAuth: true });
// }

// export function localLogin(req: Request, res: Response, next: NextFunction) {
//   console.log(req.body);
// }

// import passport from 'passport';
// // import LocalStrategy from 'passport-local';
// import MagicLoginStrategy from 'passport-magic-login';
// // const login =()=>{

// // passport.use(new LocalStrategy(function verify(username, password, cb)))

// // }
// const MagicStrategy = MagicLoginStrategy.

// const magicLoadingStrategy = new MagicLoginStrategy({
//   callbackUrl: "/auth/magiclogin/callback/",
//   sendMagicLink: async (destination, href) => {
//     await sendEmail({
//       to: destination,
//       body: `Click this link to finish logging in: https://yourcompany.com${href}`,
//     });
//   },

//   verify: (payload, callback) => {
//     // Get or create a user with the provided email from the database
//     getOrCreateUserWithEmail(payload.destination)
//       .then((user) => {
//         callback(null, user);
//       })
//       .catch((err) => {
//         callback(err);
//       });
//   },
// });

// /*passport.use(new LocalStrategy(function verify(username, password, cb) {
//   db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
//     if (err) { return cb(err); }
//     if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

//     crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//       if (err) { return cb(err); }
//       if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//         return cb(null, false, { message: 'Incorrect username or password.' });
//       }
//       return cb(null, row);
//     });
//   });
// })); */

const signupUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        username,
      },
    });

    res.json({ user });
  } catch (err) {
    console.log(err);
  }
};

export { signupUser };

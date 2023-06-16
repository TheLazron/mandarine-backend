import session from "express-session";

const expressSessionConfig = session({
  secret: "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 120 * 60 * 1000,
  },
});

export default expressSessionConfig;

/* Author: Bhishman Desai */
import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/* Middleware to verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    /* Check user's existence */
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find the user!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication error!" });
  }
}

/* PUT: /api/register */
export async function register(req, res) {
  try {
    const { username, password, profile, email, roles } = req.body;
    /* Check the existing user */
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err));
        if (user) reject("Username already in use!" );
        resolve();
      });
    });

    /* Check for existing email */
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err));
        if (email) reject("Email already in use!");
        resolve();
      });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
                roles
              });

              /* Return save result as a response */
              user
                .save()
                .then((result) =>
                  res.status(201).send({ message: "User Registered Successfully!" })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Something went wrong, please try again!",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

/* POST: /api/login */
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have password." });

            /* Create JWT token */
            const roles = Object.values(user.roles).filter(Boolean);
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
                roles
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              message: "Login Successful!",
              username: user.username,
              email:user.email,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match." });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found." });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/* GET: /api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid username" });

    UserModel.findOne({ username }, function (error, user) {
      if (error) return res.status(500).send({ err: error });
      if (!user)
        return res.status(501).send({ error: "Couldn't find the user." });

      /* Remove password from user */
      /* Mongoose return unnecessary data with object so convert it into json */
      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(404).send({ error: "Cannot find user data." });
  }
}

/* PUT: /api/updateuser */
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      /* Update the data */
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;

        return res.status(201).send({ message: "Record Updated!" });
      });
    } else {
      return res.status(401).send({ error: "User Not Found!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

/* GET: /api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/* GET: /api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; /* Reset the OTP value */
    req.app.locals.resetSession = true; /* Start session for reset password */
    return res.status(201).send({ message: "Verify Successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

/* Successfully redirect user when OTP is valid */
/* GET: /api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

/* Update the password when we have valid session */
/* PUT: /api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                function (err, data) {
                  if (err) throw err;
                  req.app.locals.resetSession = false; /* Reset session */
                  return res.status(201).send({ message: "Record Updated!" });
                }
              );
            })
            .catch((e) => {
              return res.status(500).send({
                error: "Enable to hashed password.",
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not found." });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
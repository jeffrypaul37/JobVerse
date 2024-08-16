/* Author: Bhishman Desai */
import jwt from "jsonwebtoken";

/* Auth Middleware */
export default async function Auth(req, res, next){
    try {
        /* Access authorize header to validate request */
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        /* Retrieve the user details fo the logged-in user */
        req.user = await jwt.verify(token, process.env.JWT_SECRET);
        next()

    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}

export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}

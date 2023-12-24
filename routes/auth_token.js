import { Router } from "express";
import { SignJWT, jwtVerify } from "jose";
import { USERS_BBDD } from "../bbdd.js";
import { authByEmailPwd } from "../helpers/auth-by-email-pwd.js";
import validateLoginDTO from "../dto/validate_login_dto.js";

const authTokenRouter = Router()

authTokenRouter.post('/login', validateLoginDTO, async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) return res.sendStatus(400)

    try {
        const {guid} = authByEmailPwd(email, password)

        const jwtConstructor = new SignJWT({ guid })

        const encoder = new TextEncoder()
        const jwt = await jwtConstructor.setProtectedHeader({alg: 'HS256', typ:'JWT'})
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY))

        return res.send({jwt})
    } catch (e) {
        return res.sendStatus(401)
    }
})

// Request authenticated 
authTokenRouter.get('/profile', async (req, res) => {
    const {authorization} = req.headers

    if(!authorization) return res.status(401)

    try {
        const encoder = new TextEncoder()
        const {payload} = await jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY))
        
        const user = USERS_BBDD.find(user => user.guid === payload.guid)
        
        if (!user) return res.sendStatus(401);
 
        delete user.password;

        return res.send(user)
    } catch (e) {
        return res.status(401)
    }
})

export default authTokenRouter
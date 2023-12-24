import { Router } from "express";
import { authByEmailPwd } from "../helpers/auth-by-email-pwd.js";

const authRouter = Router()

// Public ENDPOINT (no authentication and no authorization)
authRouter.get("/public", (req, res) => res.send("Endpoint publico"))

// Authen ENDPOINT to every registered user
authRouter.post("/authentication", (req, res) => {
    const {email, password} = req.body

    if (!email || !password ) return res.sendStatus(400)

    try {
        const user = authByEmailPwd(email, password)
        return res.send(`User ${user.name} authenticated`)
    } catch (e) {
        return res.sendStatus(401)
    }
})

// author ENDPOINT to admin
authRouter.post("/ ", (req, res) => {
    const { email, password } = req.body

    if (!email || !password ) return res.sendStatus(400)

    try {
        const user = authByEmailPwd(email, password)
        if (user.role !== 'admin') return res.sendStatus(403) 
        return res.send(`User admin ${user.name}`) 
    } catch (e) {
        return res.sendStatus(401)
    }
})

export default authRouter
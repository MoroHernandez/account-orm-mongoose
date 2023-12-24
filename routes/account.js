import { Router } from "express";
import userModel from "../schemas/user-schema.js";

const accountRouter = Router()

accountRouter.use((req, res, next) => {
    console.log(req.ip);

    next()
})

// Get account by guid
accountRouter.get('/:guid', async (req, res) => {
    const { guid } = req.params
    const user = await userModel.findById(guid).exec()
    
    if (!user) return res.status(404).send()

    res.send(user)
})

// Create a new accoount
accountRouter.post('/', async (req, res) => {
    const { guid, name } = req.body

    if (!guid || !name) return res.status(400).send()

    const user = await userModel.findById(guid).exec()
    
    if (user) return res.status(409).send('User is already registered')

    const newUser = new userModel({_id:guid, name})
    newUser.save()

    return res.send('Registered user')
})

// Update a name account
accountRouter.patch('/:guid', async (req, res) => {
    const { guid } = req.params
    const { name } = req.body

    if (!name) return res.status(400).send()

    const user = await userModel.findById(guid).exec()
    
    if (!user) return res.status(404).send()

    user.name = name

    await user.save()
    
    return res.send('User modified')
})

// Delete an account
accountRouter.delete('/:guid', async (req, res) => {
    const { guid } = req.params

    const result = await userModel.deleteOne({ _id: guid }).exec();
    
    if (result.deletedCount === 0) return res.status(404).send('User not found')

    return res.send('User deleted')
})

export default accountRouter
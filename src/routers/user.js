const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async(req,res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req,res)=> {
    try {
        console.log('hi')
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

router.get('/users/logout',auth,async(req,res) => {
    try{
        const cart = await req.user.getCart()
        res.status(200).send(cart)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/cart',auth,async(req,res) => {
    try{
        const cart = await req.user.getCart()
        res.status(200).send(cart)
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports = router
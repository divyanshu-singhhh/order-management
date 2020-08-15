const express = require('express')
const auth = require('../middleware/auth')
const Product = require('../models/products')

const router = new express.Router()

router.post('/products', async(req,res) => {
    const product = new Product(req.body)
    try{
        await product.save()
        res.status(201).send()
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/products', auth, async(req,res) => {
    try{
        const products = await Product.find()
        res.status(200).send(products)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/products/addToCart', auth, async(req,res) => {
    try{
        const cart = await req.user.addToCart(req.body.productId,req.body.quantity)
        res.status(201).send(cart)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
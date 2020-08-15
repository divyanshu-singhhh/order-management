const express = require('express')
const Transaction = require('../models/transactions')
const auth = require('../middleware/auth')

const router = new express.Router()


router.post('/transaction' , auth, async(req,res) => {
    try{    
        const user = req.user
        const transaction = new Transaction({amount : req.body.amount,user: user._id, date: Date.now()})
        await transaction.save()
        user.cart = []
        await user.save()
        res.status(200).send(transaction)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/transaction' , auth, async(req,res) => {
    try{    
        await req.user.populate('transactions').execPopulate()
        res.status(200).send(req.user.transactions)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
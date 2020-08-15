const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const transactionRouter = require('./routers/transactions')

const app = express()

app.use(express.static('public'))

app.use(express.json())
app.use(userRouter)
app.use(productRouter)
app.use(transactionRouter)



app.listen(process.env.PORT , () => {
    console.log('App is running on port ' + process.env.PORT)
})
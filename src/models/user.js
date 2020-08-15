const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Product = require('./products')
const Transaction =  require('./transactions')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    cart:[{
        productId: {
            type: String,
            required: true
        },
        quantity:{
            type: Number
        }
    }]
})

userSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.addToCart = async function (productId,quantity) {
    const user = this
    if(!quantity){
        quantity = 1
    }

    //check if product exists
    const productIndex = user.cart.findIndex((product) => product.productId == productId)

    //add product if it doesnt exist in cart
    if(productIndex === -1){
        user.cart.push({productId,quantity})
        await user.save()
        return user.cart
    }

    //increase quantity if product already exists
    user.cart[productIndex].quantity += quantity
    await user.save()
    return user.cart
}

userSchema.methods.getCart = async function() {
    const user = this

    if(!user.cart){
        return user.cart
    }

    //stores all the product data
    const cart = []

    //stores grand total of cart
    let cartTotal = 0
    for(cartproduct of user.cart){
        //get all the data about product using product id
        const product = await Product.findOne({_id: cartproduct.productId})
        const total = product.price * cartproduct.quantity
        cartTotal += total
        //push all the detail to the cart variable
        cart.push({product, quantity: cartproduct.quantity,total})
    }

    const cartDetails = {cart,cartTotal}
    return cartDetails
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User
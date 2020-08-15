
//login user
const loginuser = () => {
    const email = document.getElementById('loginmail').value 
    const password = document.getElementById('loginpass').value 
    $.ajax({
        url: '/users/login',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({email,password}),
        success: (data) => {
            Cookies.set('authToken', data.token)
            document.getElementById('login-message').innerHTML = 'Login Successful, You can view products now'
            fadeField('login-message')
            console.log(data)
        },
        error: (data) => {
            document.getElementById('login-message').innerHTML = data.responseJSON.error
            fadeField('login-message')
            console.log(data.responseJSON.error)
        }
    })
}

//signup user
const signup = () => {
    const name = document.getElementById('name').value
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-pass').value
    $.ajax({
        url: '/users',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({name,email,password}),
        success: (data) => {
            document.getElementById('signup-message').innerHTML = "Signup Successful, You can login now"
            fadeField('signup-message')
        },
        error: (data) => {
            document.getElementById('signup-message').innerHTML = "Signup Failed"
            fadeField('signup-message')
        }
    })
}


const fadeField = (element) => {
    setTimeout(function(){
        document.getElementById(element).innerHTML = ""
    }, 3000)
}

//get product
const getProducts = () => {
    $.ajax({
        url: '/products',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
        success: (data) => {
            populateProducts(data)
            console.log(data)
        },
        error: (data) => {
            document.getElementById('error-message').innerHTML = "Please Login First to see the products"
            console.log(data)
        }
    })
}


//populate page with products
const populateProducts = (data) => {
    const productBox = document.getElementById('product-box')
    console.log(productBox)

    for(product of data){
        console.log(product._id)
        let html = `<div class="col-sm-6 col-md-6 col-lg-4 col-xl-4"><div class="products-single fix" ><div class="box-img-hover"> <img src="$image" class="" alt="Image" style="height: 400px; width: 100%; object-fit: cover;"></div> <div class="why-text"> <h4>$name</h4><h5>$price</h5> <button class="cart" onclick="addToCart('$id')">Add to Cart</button></div></div></div>`
        html = html.replace('$id',product._id)
        html = html.replace('$image',product.image)
        html = html.replace('$price','$ ' + product.price)
        html = html.replace('$name',product.name)

        productBox.insertAdjacentHTML('beforeend', html)
    }
}


//add product to cart
const addToCart = (productId) => {
    $.ajax({
        url: '/products/addToCart',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
        data: JSON.stringify({productId}),
        success: (data) => {
            alert('Product Added To Cart Succesfully')
        },
        error: (data) => {
            alert('Cant add Product')
        }
    })
}


//get all the product in cart
const getMyCart = () => {
    $.ajax({
        url: '/users/cart',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
        success: (data) => {
            populateCart(data)
            console.log(data)
        },
        error: (data) => {
            console.log(data)
        }
    })
}

//Fill the values on the page
const populateCart = (data) => {
    const tableBox = document.getElementById('table-box')
    console.log(tableBox)

    for(product of data.cart){
        console.log(product._id)
        let html = `<tr> <td class="thumbnail-img"><a href="#"><img class="img-thumbnail" src="$image" alt="" /></a></td><td class="name-pr"><a href="#"> $name </a></td><td class="price-pr"><p>$ $price</p></td><td class="quantity-box"><p style="text-align: center;">$quantity</p></td><td class="total-pr"><p>$ $total</p></td> </tr>`
        html = html.replace('$image',product.product.image)
        html = html.replace('$name',product.product.name)
        html = html.replace('$price',product.product.price)
        html = html.replace('$quantity',product.quantity)
        html = html.replace('$total',product.total)

        tableBox.insertAdjacentHTML('beforeend', html)
    }

    //update total
    document.getElementById('sub-total').innerHTML = "$ " + data.cartTotal
    document.getElementById('grand-total').innerHTML = "$ " + data.cartTotal

}


//checkout cart items
const checkout = () => {
    const amount = document.getElementById('sub-total').innerHTML.split(' ')[1]

    $.ajax({
        url: '/transaction',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
        data: JSON.stringify({amount}),
        success: (data) => {
            document.getElementById('table-box').innerHTML = ""
            document.getElementById('sub-total').innerHTML = "$ 0"
            document.getElementById('grand-total').innerHTML = "$ 0"
            alert("Checkout Successful, Continue Shopping!")
        },
        error: (data) => {
            alert('Cannot Checkout')
        }
    })

}

//get all transactions

const getTransactions = () => {
    $.ajax({
        url: '/transaction',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
        success: (data) => {
            populateTransactions(data)
        },
        error: (data) => {
            // alert('cant fetch transactions')
            console.log(data)
        }
    })
}

const populateTransactions = (data) => {
    const tableBox = document.getElementById('table-box')
    for(transaction of data){
        let html = `<tr><td class="reference-pr"><a href="#"> $reference</a> </td> <td class="ampunt-pr"> <p>$ $amount</p></td><td class="time-box">  <p>$time</p> </td> </tr>`
        html = html.replace('$reference',transaction._id)
        html = html.replace('$amount',transaction.amount)
        html = html.replace('$time',moment(transaction.date).format('MMMM Do YYYY, h:mm:ss a'))
        tableBox.insertAdjacentHTML('beforeend', html)
    }
}

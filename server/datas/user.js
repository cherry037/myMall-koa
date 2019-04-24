const User = require('./../models/user')
const goodsData = require('./good')
const getUser = (params) => {
    return User.findOne(params)
}
const getCartCount = async (params) => {
    const user = await getUser(params)
    let count = 0
    if (user) {
        user.cartList.map((item) => {
            count += parseInt(item.productNum)
        })
        return count
    }
}
const saveUser = (user) => {
    return user.save()
}
const addCart = async (userId, productId) => {
    const user = await getUser({userId})
    let goodsItem = ''
    user.cartList.forEach(item => {
        if (item.productId === productId) {
            goodsItem = item
            item.productNum ++
        }
    })
    if (goodsItem) {
        return saveUser(user)
    } else {
        const good = await goodsData.getOneGood({productId})
        if (good) {
            user.cartList.push({
                "productId": good.productId,
                "productName": good.productName,
                "salePrice": good.salePrice,
                "productImage": good.productImage,
                "productNum": 1,
                "check": 1
            })
            return saveUser(user)
        }
    }
}
const editCart = (userId, checked, productId, productNum) => {
    return User.updateOne({"userId": userId, "cartList.productId": productId}, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked
    })
}
const delCart = (userId, productId) => {
    return User.updateOne({"userId": userId}, {
        $pull: {
            "cartList": {
                "productId": productId
            }
        }
    })
}

const editAddress = async (userId, addressId) => {
    const user = await getUser({userId})
    user.addressList.forEach(item => {
        if (item.addressId === addressId) {
            item.isDefault = true
        } else {
            item.isDefault = false
        }
    })
    return saveUser(user)
}

const delAddress = async (userId, addressId) => {
    const user = await getUser({userId})
    user.addressList.forEach((item, index) => {
        if (item.addressId === addressId){
            user.addressList.splice(index, 1)
        }
    })
    return saveUser(user)
}
const payment = async (userId, orderTotal, addressId, orderId, createDate) => {
    const user = await getUser({userId})
    let address = {}
    let goodList = []
    user.addressList.forEach(item => {
        if (item.addressId === addressId) {
            address = item
        }
    })
    user.cartList.forEach(item => {
        if (item.checked === '1') {
            goodList.push(item)
        }
    })
    const order = {
        orderId,
        orderTotal,
        addressInfo: address,
        goodList,
        orderStatus: 1,
        createDate
    }
    user.orderList.push(order)
    return saveUser(user)
}

module.exports = {
    getUser,
    getCartCount,
    saveUser,
    addCart,
    editCart,
    delCart,
    editAddress,
    delAddress,
    payment
}
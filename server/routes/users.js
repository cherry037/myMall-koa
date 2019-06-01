const router = require('koa-router')({prefix: '/users'})
const userData = require('./../datas/user')
const {errorCaptured, errHandler, successHandler} = require('./../utils/util')
Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

router
    .post('/login', async (ctx, next) => {
        let {userName, userPwd} = ctx.request.body
        // const user = await userData.getUser({userName, userPwd})
        let [err, user] = await errorCaptured(userData.getUser, {userName, userPwd})
        if (user) {
            ctx.cookies.set('userId', user.userId, {
                maxAge: 1000*60*60*1000,
                path: '/'
            })
            ctx.body = successHandler({
                userName: user.userName
            })
        } else {
            ctx.body = errHandler(err)
        }
    })
    .post('/logout', (ctx) => {
        ctx.cookies.set('userId', '', {
            maxAge: -1,
            path: '/'
        })
        ctx.body = {
            status: '0',
            msg: '',
            result: 'suc'
        }
    })
    .get('/checkLogin', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        // const user = await userData.getUser({userId})
        let [err, user] = await errorCaptured(userData.getUser, {userId})
        ctx.body = user ? successHandler(user.userName) : errHandler(err)
    })
    .get('/cartCount', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        // const cartCount = await userData.getCartCount({userId})
        let [err, cartCount] = await errorCaptured(userData.getCartCount, {userId})
        ctx.body = cartCount ? successHandler(cartCount) : errHandler(err)
    })
    .get('/cartList', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        // const user = await userData.getUser({userId})
        let [err, user] = await errorCaptured(userData.getUser, {userId})
        ctx.body = user ? successHandler({cartList: user.cartList}) : errHandler(err)
    })
    .post('/editCart', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const { checked, productNum, productId } = ctx.request.body
        // const user = await userData.editCart(userId, checked, productId, productNum)
        let [err, user] = await errorCaptured(userData.editCart, {userId, checked, productId, productNum})
        ctx.body = user ? successHandler('suc') : errHandler(err)
    })
    .post('/delCart', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const { productId } = ctx.request.body
        // const user = await userData.delCart(userId, productId)
        let [err, user] = await errorCaptured(userData.delCart, {userId, productId})
        ctx.body = user ? successHandler('suc') : errHandler(err)
    })
    .get('/addressList', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        // const user = await userData.getUser({userId})
        let [err, user] = await errorCaptured(userData.getUser, {userId})
        ctx.body = user ? successHandler({addressList: user.addressList}) : errHandler(err)
    })
    .post('/setDefault', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const { addressId } = ctx.request.body
        const user = userData.editAddress(userId, addressId)
        ctx.body = user ? successHandler('suc') : errHandler('fail')
    })
    .post('/delAdress', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const { addressId } = ctx.request.body
        const user = userData.delAddress(userId, addressId)
        ctx.body = user ? successHandler('suc') : errHandler('fail')
    })
    .post('/payment', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const platform = '622'
        const r1 = Math.floor(Math.random() * 10)
        const r2 = Math.floor(Math.random() * 10)
        const sysDate = new Date().Format('yyyMMddhhmmss')
        const createDate = new Date().Format('yyy-MM-dd hh:mm:ss')
        const orderId = platform + r1 + sysDate + r2
        const { orderTotal, addressId } = ctx.request.body
        let [err, user] = await errorCaptured(userData.payment, {userId, orderTotal, addressId, orderId, createDate})
        ctx.body = user ? successHandler({orderId, orderTotal}) : errHandler(err)
    })

module.exports = router

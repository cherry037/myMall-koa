const router = require('koa-router')({prefix: '/goods'})
const goodsData = require('./../datas/good')
const userData = require('./../datas/user')
const {errorCaptured, errHandler, successHandler} = require('./../utils/util')
router
    .get('/list', async (ctx, next) => {
        const params = ctx.request.query
        // const goods = await goodsData.getGoodsList(params)
        let [err, goods] = await errorCaptured(goodsData.getGoodsList, params)
        ctx.body = goods ? successHandler({count: goods.length, list: goods}) : errHandler(err)
    })
    .post('/addCart', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const {productId} = ctx.request.body
        // const user = await userData.addCart(userId, productId)
        let [err, user] = await errorCaptured(userData.addCart, {userId, productId})
        ctx.body = user ? successHandler('suc') : errHandler(err)
        // if (user) {
        //     ctx.body = {
        //         status: '0',
        //         msg: '',
        //         result: 'suc'
        //     }
        // }
    })                                                                

module.exports = router

const router = require('koa-router')({prefix: '/goods'})
const goodsData = require('./../datas/good')
const userData = require('./../datas/user')
router
    .get('/list', async (ctx, next) => {
        const params = ctx.request.query
        const goods = await goodsData.getGoodsList(params)
        if (goods) {
            ctx.body = {
                status: '0',
                msg: '',
                result: {
                    count: goods.length,
                    list: goods
                }
            }
        } else {
            ctx.body = {
                status: '1',
                mag: '暂无商品！',
                result: ''
            }
        }
    })
    .post('/addCart', async (ctx) => {
        const userId = ctx.cookies.get('userId')
        const {productId} = ctx.request.body
        const user = await userData.addCart(userId, productId)
        if (user) {
            ctx.body = {
                status: '0',
                msg: '',
                result: 'suc'
            }
        }
    })                                                                

module.exports = router

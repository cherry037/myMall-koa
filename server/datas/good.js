var Goods = require('./../models/goods')

const getGoodsList = (query) => {
    let { pageIndex, pageSize, priceLevel, sort } = query
    pageIndex = Number(pageIndex)
    pageSize = Number(pageSize)
    let skip = (pageIndex - 1) * pageSize
    let priceGt = ''
    let priceLte = ''
    let params = {}
    if (priceLevel !== 'all') {
        switch (priceLevel) {
            case '0': 
                priceGt = 0
                priceLte = 100
                break;
            case '1': 
                priceGt = 100
                priceLte = 500
                break;
            case '2': 
                priceGt = 500
                priceLte = 1000
                break;
            case '3': 
                priceGt = 1000
                priceLte = 5000
                break;
            default: 
                priceGt = ''
                priceLte = ''
        }
        params = {
            "salePrice": {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }
    return Goods.find(params).skip(skip).limit(pageSize).sort({'salePrice': sort})
}
const getOneGood = (params) =>{
    return Goods.findOne(params)
}

module.exports = {
    getGoodsList,
    getOneGood
}
async function errorCaptured (asyncFunc, params) {
    try {
        let res = await asyncFunc(params)
        return [null, res]
    } catch (e) {
        return [e, null]
    }
}
function errHandler (err) {
    return {
        status: '1',
        msg: err,
        result: ''
    }
}
function successHandler(result){
    return {
        status: '0',
        msg: '',
        result: result
    }
}
module.exports = {
    errorCaptured,
    errHandler,
    successHandler
}
const asyncWrapper = (fn) => {
    return async(req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            // next is a function provided by the framework that allows you to pass control to the next middleware in the stack - errorHandlerMiddleware
            next(error)
        }
    }
}

module.exports = asyncWrapper
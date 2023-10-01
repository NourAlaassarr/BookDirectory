
export const generalFields={}


const reqMethods = ['body', 'query', 'headers', 'file', 'files', "params"]
export const ValidationCoreFunction = (schema) => {
    return (req, res, next) => {
        //req
        const ValidationErrArray = []
        for (const key of reqMethods) {
            if (schema[key]) {
                const ValidationResults = schema[key].validate(req[key], {
                    abortEarly: false,
                })

                if (ValidationResults.error) {
                    ValidationErrArray.push(ValidationResults.error.details)

                }
            }

        }
        if (ValidationErrArray.length) {
            // return res
            // .status(400)
            // .json({ message: 'Validation Error', Errors: ValidationErrArray })
            req.ValidationErrArray = ValidationErrArray
            return next(new Error('', { cause: 400 }))
        }
        next()


    }
}
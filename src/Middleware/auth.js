import { UserModel } from "../../DB/Models/User.Model.js"
import { GenerateToken, VerifyToken } from "../utlis/TokenFunction.js"

export const isAuth = (Role) => {
    return async (req, res, next) => {
        try {
            const Token = req.headers.token

            if (!Token) {
                return res.status(400).json({ message: 'No token provided.' })
            }

            try {
                const DecodedData = VerifyToken({ token: Token, signature: process.env.SIGN_IN_TOKEN_SECRET })
                if (!DecodedData || !DecodedData._id) {
                    return res.status(400).json({ Message: 'error invalid token!' })
                }
                const User = await UserModel.findById(DecodedData._id, 'Email UserName Password role')
                if (!User) {
                    return res.status(400).json({ Message: 'Please Sign Up First!' })
                }
                if (!Role.includes(User.role)) {
                    return next(new Error('unauthorized to acceess this api', { cause: 401 }))
                }
                req.authUser = User
                next()
            }
            catch (error) {
                if (error == 'TokenExpiredError: jwt expired') {
                    const user = await UserModel.findOne({ token: Token })
                    if (!user) {
                        return next(new Error('wrong token', { cause: 500 }))
                    }

                    const userToken = GenerateToken({
                        payload: {
                            UserName: user.UserName,
                            _id: user._id,
                            Email: user.Email,
                            password: user.Password
                        },
                        signature: process.env.SIGN_IN_TOKEN_SECRET,
                        expiresIn: '1h'
                    }, { expiresIn: "1h" })
                    // user.token= userToken
                    // await user.save()
                    await UserModel.findOneAndUpdate(
                        { token: Token },
                        { token: userToken })
                    return res.status(200).json({ message: 'Token refreshed', userToken })

                }
                console.log(error)
                return next(new Error('invalid tokenn', { cause: 500 }))
            }
        }
        catch (error) {
            return next(new Error('error .', { cause: 500 }))
            console.log(error)
        }

    }
}

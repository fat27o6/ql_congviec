import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

let users
export default class userDAO{
    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db(process.env.QLCV_DB_NAME).collection("users")
        } catch (e) {
            console.error(`Unable to establish a collection handle in userDAO: ${e}`)
        }
    }
    static async register(username, email, password) {
        const user = await users.findOne({ $or: [{ email }, { username }] })
        if (user) throw new Error('User already exists')
        const hashedPassword = await bcrypt.hash(password, 10)
        const doc = { username, email, password: hashedPassword, createdAt: new Date() }

        const { insertedId } = await users.insertOne(doc)
        return insertedId
    }
    static async login({ identity, password }) {
        try {
            const user = await users.findOne({ $or: [{ email: identity }, { username: identity }] })
            if (!user) throw new Error('User not found')

            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) throw new Error('Invalid password')

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

            delete user.password
            const result = { user, token }
            return result
        } catch (e) {
            console.error(`Unable to login user in userDAO: ${e}`)
            throw e
        }
    }

}
import userDAO from "../models/userDAO.js";

export default class UserController {
    static async register(req, res) {
        const { email, password, username } = req.body
        try {
            const userId = await userDAO.register(username, email, password)
            res.status(201).json({ message: "User registered successfully" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async login(req, res) {
        try {
            const { identity, username, email, password } = req.body
            const id = identity || username || email
            const result = await userDAO.login({ identity: id, password })
            res.status(200).json(result)
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }
}
import { Request, Response } from "express";
import UserModel from "../models/UserModel";

class UserController {
    constructor(private userModel: UserModel) { }

    getUserData = (req: Request, res: Response) => {
        const { q } = req.query
        if (!q) {
            return res.status(500).json({ message: 'Query parameter `q` is required' });
        }

        if (Array.isArray(q)) {
            return res.status(500).json({ message: 'Query parameter `q` must be a string' });
        }
        const search = q.toString().toLowerCase();

        const filteredData = this.userModel.filterDataByQuery(search);
        console.log(filteredData, search);
        
        return res.status(200).json({ data: filteredData });
    }
}

export default UserController;
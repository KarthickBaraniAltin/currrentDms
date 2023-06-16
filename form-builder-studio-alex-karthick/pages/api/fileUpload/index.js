import axios from "axios";

export default async function handler(req, res) {
    const { method, body, headers } = req

    if (headers.authorization) {
        axios.defaults.headers['Authorization'] = headers.authorization;
    } else {
        delete axios.defaults.headers['Authorization'];
    }

    if (method === 'POST') {
        try {
            res.status(200).json(result.data.users)
        } catch (error) {
            console.log(error)
            res.status(405).json({result: 'Internal Error'})
        }
    } else {
        res.setHeader('Allow', ['POST']);
    }
}
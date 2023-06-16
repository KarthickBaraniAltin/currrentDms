import axios from "axios";
import { getFormDefinitions, postFormDefinition } from "../../../api/apiCalls";

export default async function handler(req, res) {
    const { method, body, headers } = req

    if (headers.authorization) {
        axios.defaults.headers['Authorization'] = headers.authorization
    } else {
        delete axios.defaults.headers['Authorization']
    }

    if (method === 'GET') {
        try {
            const result = await getFormDefinitions()
            res.status(200).json(result.data)
        } catch (error) {
            console.log(error)
            res.status(405).json({result: 'Internal Error'})
        }
    } else if (method === 'POST') {
        try {
            const result = await postFormDefinition(body)
            res.status(200).json(result.data)
        } catch (error) {
            console.log(error)
            res.status(405).json({result: `Internal Error: ${error}`})
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
    }
}
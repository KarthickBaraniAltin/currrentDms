import axios from 'axios'
import { getAllFormSubmissionsFiltered } from '../../../api/apiCalls'

export default async function handler(req, res) {
    const { method, body, headers } = req
    const { query } = body

    if (headers.authorization) {
        axios.defaults.headers['Authorization'] = headers.authorization
    } else {
        delete axios.defaults.headers['Authorization']
    }

    if (method === 'POST') {
        try {
            const result = await getAllFormSubmissionsFiltered(query)
            res.status(200).json(result.data)
        } catch (error) {
            console.error(error)
            res.status(405).json({result: 'Internal Error'})
        }
    } else {
        res.setHeader('Allow', ['POST'])
    }
}
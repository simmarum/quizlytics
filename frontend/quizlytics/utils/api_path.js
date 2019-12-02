import { get_auth_header } from '../utils/auth'

const protocol = 'http'
const host = '127.0.0.1'
const port = '8000'

const api_url = `${protocol}://${host}:${port}/api/`

export const api_path = {
    'token': `${api_url}token/`,
    'users': `${api_url}users/`
}

export const fetch_get = async (ctx, url, token) => {
    console.log("%", url, get_auth_header(token))
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: get_auth_header(token),
        })
        if (response.ok) {
            const data = await response.json()
            console.log("!@#", data)
            return data
        } else {
            console.log('Login failed.')
            const data = await response.json()
            if (ctx.setState) {
                ctx.setState({ error: Object.entries(data) })
            }
        }
    } catch (error) {
        console.error(
            'You have an error in your code or there are Network issues.',
            error
        )
        throw new Error(error)
    }
}
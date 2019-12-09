import { get_auth_header } from './auth'

const protocol = 'http'
const host = '127.0.0.1'
const port = '8000'

const api_url = `${protocol}://${host}:${port}/api/`

export const api_path = {
    'token': `${api_url}token/`,
    'token_verify': `${api_url}token/verify/`,
    'token_refresh': `${api_url}refresh/`,
    'users': `${api_url}users/`,
    'cities': `${api_url}cities/`,
}

export const fetch_get = async (ctx, url, token) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: get_auth_header(token),
        })
        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            console.log('Request GET failed: ' + url)
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

export const fetch_post = async (ctx, url, token, p_body) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: get_auth_header(token),
            body: p_body,
        })
        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            console.log('Request POST failed: ' + url)
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
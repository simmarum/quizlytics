const protocol = 'http'
const host = '127.0.0.1'
const port = '8000'

const api_url = `${protocol}://${host}:${port}/api/`

export const api_path = {
    'token': `${api_url}token/`,

    'users': `${api_url}users/`
}
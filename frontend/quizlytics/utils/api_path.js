import { get_auth_header } from './auth'
import fetch from 'isomorphic-unfetch'

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
  'questions': `${api_url}questions/`,
  'questions_answers': `${api_url}questions_answers/`,
  'mail_send': `${api_url}mail_send/`,
}

export function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

export const fetch_get = async (ctx, url, token) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: get_auth_header(token),
    })
    if (response.ok) {
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: undefined, success: true })
      }
      return data
    } else {
      console.log('Request GET failed: ' + url)
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: Object.entries(data), success: undefined })
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
      if (ctx.setState) {
        ctx.setState({ error: undefined, success: true })
      }
      return data
    } else {
      console.log('Request POST failed: ' + url)
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: Object.entries(data), success: undefined })
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

export const fetch_patch = async (ctx, url, token, p_body) => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: get_auth_header(token),
      body: p_body,
    })
    if (response.ok) {
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: undefined, success: true })
      }
      return data
    } else {
      console.log('Request PATCH failed: ' + url)
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: Object.entries(data), success: undefined })
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

export const fetch_delete = async (ctx, url, token) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: get_auth_header(token),
    })
    if (response.ok) {
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: undefined, success: true })
      }
      return data
    } else {
      console.log('Request DELETE failed: ' + url)
      const data = await response.json()
      if (ctx.setState) {
        ctx.setState({ error: Object.entries(data), success: undefined })
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

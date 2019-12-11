import nextCookie from 'next-cookies'
import Cookies from "js-cookie";
import Router from 'next/router'
import { api_path } from './api_path'

export const get_auth_header = (token) => {
  if ((token == null) || (typeof token == 'undefined')) {
    return {
      'Content-Type': 'application/json'
    }
  } else {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
}
export const set_token = (token_pair) => {
  let is_token_set = true
  if ('access' in token_pair) {
    Cookies.set('token', token_pair.access, { expires: 1 })
    is_token_set = is_token_set & (typeof Cookies.get('token') !== 'undefined')
  }
  if ('refresh' in token_pair) {
    Cookies.set('token_refresh', token_pair.refresh, { expires: 1 })
  }

  return [is_token_set, Cookies.get('token')]
}

export const get_token = () => {
  return {
    'token': Cookies.get('token'),
    'token_refresh': Cookies.get('token_refresh')
  }
}

const remove_token = () => {
  Cookies.remove('token')
  Cookies.remove('token_refresh')
}

export const login = (token_pair) => {
  if (typeof token_pair !== 'undefined') {
    set_token(token_pair)
    Router.push('/profile')
  } else {
    remove_token()
  }
}

export const verify_token = async (token, refresh) => {
  if ((typeof token !== 'undefined') && (typeof refresh !== 'undefined')) {
    try {
      const url = api_path['token_verify']
      const p_body = JSON.stringify({ token })
      const response = await fetch(url, {
        method: 'POST',
        headers: get_auth_header(null),
        body: p_body,
      })
      if (response.ok) {
        return [true, token]
      } else {
        console.log('Token expired. Must be refresh!')
        try {
          const url = api_path['token_refresh']
          const p_body = JSON.stringify({ refresh })
          const response = await fetch(url, {
            method: 'POST',
            headers: get_auth_header(null),
            body: p_body,
          })
          if (response.ok) {
            const data = await response.json()
            return set_token(data)
          } else {
            console.log('Refresh token expired. Must login again!')
            return [false, undefined]
          }
        } catch (error) {
          console.error(
            'You have an error in your code or there are Network issues.',
            error
          )
          throw new Error(error)
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
  return [false, undefined]
}

export const auth = async (ctx) => {
  const { token, token_refresh } = nextCookie(ctx)
  const [is_token_validate, token_2] = await verify_token(token, token_refresh)
  // If there's no token, it means the user is not logged in.
  if (is_token_validate == false) {
    if (ctx.req) {
      if (ctx.req.url != '/login') {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end()
        return
      }
    }
    else {
      if (Router.pathname != '/login') {
        Router.push('/login')
      }
    }
    return undefined
  } else {
    return token_2
  }
}

export const logout = () => {
  remove_token();
  Router.push("/login");
};
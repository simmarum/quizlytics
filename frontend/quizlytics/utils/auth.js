import nextCookie from 'next-cookies'
import cookie from "js-cookie";
import Router from 'next/router'

const set_token = (token_pair) => {
    cookie.set('token', token_pair.access, { expires: 1 })
    cookie.set('token_refresh', token_pair.refresh, { expires: 1 })
}

export const login = (token_pair) => {
    set_token(token_pair)
    Router.push('/profile')
}

export const auth = ctx => {
    const { token } = nextCookie(ctx)

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (ctx.req) {
            ctx.res.writeHead(302, { Location: '/login' })
            ctx.res.end()
            return
        }
        else {
            Router.push('/login')
        }
    }
    // else {
    //     if (ctx.req) {
    //         if (ctx.req.url == '/login') {
    //             ctx.res.writeHead(302, { Location: '/index' })
    //             ctx.res.end()
    //             return
    //         }
    //     } else {
    //         Router.push('/index')
    //     }
    // }


    return token
}

export const logout = () => {
    cookie.remove("token");
    Router.push("/login");
};
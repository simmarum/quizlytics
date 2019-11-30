import nextCookie from 'next-cookies'
import cookie from "js-cookie";
import Router from 'next/router'


export const login = (token_pair) => {
    console.log(token_pair)
    cookie.set('token', token_pair.access, { expires: 1 })
    cookie.set('token_refresh', token_pair.refresh, { expires: 1 })
    Router.push('/profile')
}

export const auth = ctx => {
    console.log(ctx)
    // const access = nextCookie(ctx)
    const { token } = nextCookie(ctx)
    // console.log(access)
    console.log(token)
    console.log(ctx.req)

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (ctx.req) {
            // If `ctx.req` is available it means we are on the server.
            ctx.res.writeHead(302, { Location: '/login' })
            ctx.res.end()
        } else {
            // This should only happen on client.
            Router.push('/login')
        }
    }

    return token
}


export const logout = () => {
    cookie.remove("token");
    Router.push("/login");
};
import nextCookie from 'next-cookies'
import cookie from "js-cookie";
import Router from 'next/router'
import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("../pages/login"));


export const login = (token_pair) => {
    console.log(token_pair)
    cookie.set('token', token_pair.access, { expires: 1 })
    cookie.set('token_refresh', token_pair.refresh, { expires: 1 })
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

    return token
}


export const logout = () => {
    cookie.remove("token");
    Router.push("/login");
};
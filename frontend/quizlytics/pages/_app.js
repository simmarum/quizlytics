import React from 'react'
import App from 'next/app'

import Layout from '../components/MyLayout'
import { get_token, verify_token } from '../utils/auth'

export default class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        const { token, token_refresh } = get_token()
        const [is_logged, token_2] = await verify_token(token, token_refresh)
        pageProps.is_logged = is_logged

        return { pageProps }
    }

    render() {
        const { Component, pageProps } = this.props
        return (
            <Layout {...pageProps}>
                <Component {...pageProps} />
            </Layout>
        )
    }
}
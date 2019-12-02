import React from 'react'
import App, { Container } from 'next/app'

import Header from '../components/Header'
import Layout from '../components/MyLayout'
import { auth } from '../utils/auth'

export default class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {}


        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        /* your own logic */
        const token = auth(ctx);
        pageProps.is_logged = token !== undefined

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
import React from 'react';
import 'fomantic-ui-css/semantic.min.css';
import App from 'next/app';
import { Container } from 'typedi';
import { env } from '@vdtn359/news-utils';
import { ThemeProvider } from 'styled-components';

const theme = {
    colors: {
        grey: '#e9ebee',
        white: '#fff',
        transparent: 'rgba(0, 0, 0, 0)',
        black: '#000',
    },
};

class NewsApp extends App<any> {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        const container = Container.of(ctx.req);
        if (ctx.req) {
            container.set(
                'baseUrl',
                `${
                    env.isDevelopment() ? ctx.req.protocol || 'http' : 'https'
                }://${ctx.req.headers.host}`
            );
        } else {
            container.set('baseUrl', window.location.origin);
        }
        ctx.container = container;
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return { pageProps };
    }
    render() {
        const { Component, pageProps } = this.props;
        return (
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        );
    }
}

export default NewsApp;

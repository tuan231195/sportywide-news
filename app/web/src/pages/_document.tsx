import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface Props {
    styleTags: string;
}

export default class NewsDocument extends Document<Props> {
    static async getInitialProps(ctx) {
        // Step 1: Create an instance of ServerStyleSheet
        const sheet = new ServerStyleSheet();

        let page = {};
        try {
            // Step 2: Retrieve styles from components in the page
            page = ctx.renderPage((App) => (props) =>
                sheet.collectStyles(<App {...props} />)
            );
        } catch (e) {
            if (typeof window === 'undefined') {
                import('src/setup').then(({ logger, Sentry }) => {
                    logger.error(`Page ${ctx.pathname} rendering error: `, e);
                    Sentry.captureException(e);
                });
            }
            throw e;
        }

        // Step 3: Extract the styles as <style> tags
        const styleTags = sheet.getStyleElement();

        const initialProps = await Document.getInitialProps(ctx);

        // Step 4: Pass styleTags as a prop
        return { ...initialProps, ...page, styleTags };
    }

    render() {
        return (
            <html>
                <Head>
                    <meta
                        httpEquiv="Content-Type"
                        content="text/html; charset=UTF-8"
                    />
                    <meta name="application-name" content="PWA App" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta
                        name="apple-mobile-web-app-status-bar-style"
                        content="default"
                    />
                    <meta name="apple-mobile-web-app-title" content="PWA App" />
                    <meta name="description" content="News App" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-TileColor" content="#2B5797" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#000000" />
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                    />

                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/apple-touch-icon.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon-16x16.png"
                    />
                    <link rel="manifest" href="/manifest.json" />
                    {this.props.styleTags}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Vollkorn&display=swap"
                        rel="preconnect"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

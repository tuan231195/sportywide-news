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
                    {this.props.styleTags}
                    <link
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css"
                        rel="stylesheet"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Vollkorn&display=swap"
                        rel="stylesheet"
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

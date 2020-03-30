import React from 'react';
import 'fomantic-ui-css/semantic.min.css';
import 'src/styles.scss';
import App from 'next/app';
import { Container } from 'typedi';
import { env, promises } from '@vdtn359/news-utils';
import styled, { ThemeProvider } from 'styled-components';
import { SideBar } from 'src/components/common/Sidebar';
import { Grid } from 'semantic-ui-react';
import { NewsContainer } from 'src/components/common/Container.styled';
import { NewsService } from 'src/services/news.service';
import { Context as ResponsiveContext } from 'react-responsive';
import { device, getDeviceWidth } from 'src/utils/device/size';
import { VnBigScreen } from 'src/components/common/Responsive';
import { onResizeOne } from 'src/utils/events/listener';

const theme = {
    colors: {
        grey: '#e9ebee',
        white: '#fff',
        transparent: 'rgba(0, 0, 0, 0)',
        black: '#000',
    },
};

const Content = styled.div`
    @media ${device.tablet} {
        width: 80%;
        max-width: 800px;
    }
`;

class NewsApp extends App<any, any, any> {
    static async getInitialProps({ Component, ctx }) {
        const container = Container.of(ctx.req);
        let deviceWidth;
        if (ctx.req) {
            container.set(
                'baseUrl',
                `${
                    env.isDevelopment() ? ctx.req.protocol || 'http' : 'https'
                }://${ctx.req.headers.host}`
            );
            deviceWidth = getDeviceWidth(ctx.req.headers['user-agent']);
        } else {
            container.set('baseUrl', window.location.origin);
        }
        ctx.container = container;
        const allPromises: any = {};
        if (Component.getInitialProps) {
            allPromises.pageProps = Component.getInitialProps(ctx);
        } else {
            allPromises.pageProps = Promise.resolve({});
        }
        const newsService = container.get(NewsService);
        allPromises.categories = newsService.fetchCategories();
        const result: any = await promises.all(allPromises);
        return {
            ...result,
            query: ctx.query,
            deviceWidth,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            deviceWidth: props.deviceWidth,
        };
    }

    componentDidMount(): void {
        onResizeOne(() => {
            this.setState({
                deviceWidth: 0,
            });
        });
    }

    render() {
        const { Component, pageProps, query } = this.props;
        console.log(this.state.deviceWidth);
        return (
            <ResponsiveContext.Provider
                value={
                    this.state.deviceWidth
                        ? { width: this.state.deviceWidth }
                        : undefined
                }
            >
                <ThemeProvider theme={theme}>
                    <NewsContainer>
                        <Grid>
                            <VnBigScreen>
                                <Grid.Column
                                    mobile={16}
                                    tablet={4}
                                    computer={4}
                                >
                                    <SideBar
                                        categories={this.props.categories}
                                    />
                                </Grid.Column>
                            </VnBigScreen>

                            <Grid.Column
                                mobile={16}
                                tablet={12}
                                computer={12}
                                className={'vn-flex vn-flex-justify-center'}
                            >
                                <Content>
                                    <Component {...pageProps} query={query} />
                                </Content>
                            </Grid.Column>
                        </Grid>
                    </NewsContainer>
                </ThemeProvider>
            </ResponsiveContext.Provider>
        );
    }
}

export default NewsApp;

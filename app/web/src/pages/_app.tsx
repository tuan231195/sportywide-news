import React from 'react';
import 'fomantic-ui-css/semantic.min.css';
import 'src/styles.scss';
import App from 'next/app';
import { promises } from '@vdtn359/news-utils';
import styled, { ThemeProvider } from 'styled-components';
import { SideBar } from 'src/components/common/Sidebar';
import { Grid } from 'semantic-ui-react';
import { NewsContainer } from 'src/components/common/Container.styled';
import { NewsService } from 'src/services/news.service';
import { Context as ResponsiveContext } from 'react-responsive';
import { device, getDeviceWidth } from 'src/utils/device/size';
import { VnBigScreen } from 'src/components/common/Responsive';
import { onResizeOne } from 'src/utils/events/listener';
import { withContainer } from 'src/utils/hoc/with-container';
import { init } from 'src/utils/container/init';

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
        let deviceWidth;
        if (ctx.req) {
            deviceWidth = getDeviceWidth(ctx.req.headers['user-agent']);
        }
        const allPromises: any = {};
        if (Component.getInitialProps) {
            allPromises.pageProps = Component.getInitialProps(ctx);
        } else {
            allPromises.pageProps = Promise.resolve({});
        }
        const container = ctx.container;
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
                                    <Component
                                        {...pageProps}
                                        query={query}
                                        container={this.props.container}
                                    />
                                </Content>
                            </Grid.Column>
                        </Grid>
                    </NewsContainer>
                </ThemeProvider>
            </ResponsiveContext.Provider>
        );
    }
}

export default withContainer(init)(NewsApp);

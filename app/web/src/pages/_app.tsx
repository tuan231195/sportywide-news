import React from 'react';
import 'fomantic-ui-css/semantic.min.css';
import 'src/styles.scss';
import App from 'next/app';
import { promises } from '@vdtn359/news-utils';
import styled, { ThemeProvider } from 'styled-components';
import { NewsCategories } from 'src/components/common/navigation/NewsCategories';
import { Grid } from 'semantic-ui-react';
import { NewsContainer } from 'src/components/common/container/Container.styled';
import { NewsService } from 'src/services/news.service';
import { Context as ResponsiveContext } from 'react-responsive';
import { device, getDeviceWidth } from 'src/utils/device/size';
import { VnBigScreen } from 'src/components/common/responsive/Responsive';
import { withContainer } from 'src/utils/hoc/with-container';
import { init } from 'src/utils/container/init';
import { ContainerContext } from 'src/utils/container/context';
import { SideBarPushable } from 'src/components/common/navigation/SideBarPushable';
import { EventDispatcher } from 'src/utils/events/event-dispatcher';
import { WINDOW_CLICK } from 'src/utils/events/event.constants';

const theme = {
    colors: {
        primary: '#0288D1',
        accent: '#FF8106',
        secondaryAccent: '#FF5C00',
        grey: '#e9ebee',
        white: '#fff',
        transparent: 'rgba(0, 0, 0, 0)',
        black: '#000',
    },
    dimen: {
        navBar: '47px',
    },
};

const Content = styled.div`
    width: 100%;
    @media ${device.tablet} {
        width: 80%;
        max-width: 750px;
    }
`;

const Root = styled.div``;

const NewsGrid = styled(Grid)`
    &&&& {
        margin: 0;
    }
`;

class NewsApp extends App<any, any, any> {
    listeners: Function[] = [];

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
        this.setState({
            deviceWidth: 0,
        });
        this.registerListeners();
    }

    registerListeners() {
        this.registerClickListeners();
    }

    registerClickListeners() {
        const eventHandler = (e) => {
            const eventDispatcher = this.props.container.get(EventDispatcher);
            eventDispatcher.trigger(WINDOW_CLICK, e);
        };
        window.addEventListener('click', eventHandler);

        this.listeners.push(() => {
            window.removeEventListener('click', eventHandler);
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
                <ContainerContext.Provider value={this.props.container}>
                    <ThemeProvider theme={theme}>
                        <Root>
                            <SideBarPushable categories={this.props.categories}>
                                <NewsContainer>
                                    <NewsGrid>
                                        <VnBigScreen>
                                            <Grid.Column
                                                mobile={16}
                                                tablet={4}
                                                computer={4}
                                            >
                                                <NewsCategories
                                                    categories={
                                                        this.props.categories
                                                    }
                                                />
                                            </Grid.Column>
                                        </VnBigScreen>

                                        <Grid.Column
                                            mobile={16}
                                            tablet={12}
                                            computer={12}
                                            className={
                                                'vn-flex-important vn-flex-justify-center'
                                            }
                                        >
                                            <Content>
                                                <Component
                                                    {...pageProps}
                                                    query={query}
                                                    container={
                                                        this.props.container
                                                    }
                                                />
                                            </Content>
                                        </Grid.Column>
                                    </NewsGrid>
                                </NewsContainer>
                            </SideBarPushable>
                        </Root>
                    </ThemeProvider>
                </ContainerContext.Provider>
            </ResponsiveContext.Provider>
        );
    }
}

export default withContainer(init)(NewsApp);
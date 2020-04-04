import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news.service';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import Head from 'next/head';

interface Props {
    news: NewsSearchDto[];
    container: ContainerInstance;
}

export default class IndexPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const news = await newsService.fetchNews();

        return {
            news,
        };
    }

    render() {
        return (
            <>
                <Head>
                    <title>Tuan&apos;s news</title>
                </Head>
                <NewsStream
                    initialNewsList={this.props.news}
                    loadFunc={(newsList) => {
                        const searchAfter =
                            newsList[newsList.length - 1] &&
                            newsList[newsList.length - 1].sort;
                        const newsService = this.props.container.get(
                            NewsService
                        );
                        return newsService.fetchNews({ searchAfter });
                    }}
                />
            </>
        );
    }
}

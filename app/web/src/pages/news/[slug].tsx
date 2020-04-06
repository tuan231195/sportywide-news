import React from 'react';
import { NewsService } from 'src/services/news.service';
import { NewsDto } from '@vdtn359/news-models';
import { ContainerInstance } from 'typedi';
import { redirect } from 'src/utils/navigation/redirect';
import { NewsDetails } from 'src/components/news/NewsDetails';
import Head from 'next/head';
import { TrackingService } from 'src/utils/tracking/tracking.service';

interface Props {
    news: NewsDto;
    similarNewsList: NewsDto[];
    container: ContainerInstance;
}

export default class NewsPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const slug = ctx.query.slug || '';

        const news = await newsService.get(slug);

        if (!news) {
            return redirect(ctx, '/404');
        }

        const similarNewsList = await newsService.suggestSimilar(news.id);

        return {
            news,
            similarNewsList,
        };
    }
    componentDidMount(): void {
        const container = this.props.container;
        const trackingService = container.get(TrackingService);
        trackingService.track({
            id: this.props.news.id,
        });
    }

    render() {
        return (
            <>
                <Head>
                    <title>{this.props.news.title}</title>
                </Head>
                <NewsDetails
                    news={this.props.news}
                    similarNewsList={this.props.similarNewsList}
                />
            </>
        );
    }
}

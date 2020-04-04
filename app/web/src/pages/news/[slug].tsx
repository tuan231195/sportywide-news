import React from 'react';
import { NewsService } from 'src/services/news.service';
import { NewsDto } from '@vdtn359/news-models';
import { ContainerInstance } from 'typedi';
import { redirect } from 'src/utils/navigation/redirect';
import { NewsBody } from 'src/components/news/NewsBody';

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
    render() {
        return (
            <NewsBody
                news={this.props.news}
                similarNewsList={this.props.similarNewsList}
            />
        );
    }
}

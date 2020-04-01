import React from 'react';
import { NewsService } from 'src/services/news.service';
import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import { ContainerInstance } from 'typedi';
import { redirect } from 'src/utils/navigation/redirect';
import { NewsBody } from 'src/components/news/NewsBody';

interface Props {
    news: NewsDto;
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

        return {
            news,
        };
    }
    render() {
        return <NewsBody news={this.props.news} />;
    }
}

import React from 'react';
import { NewsService } from 'src/services/news.service';
import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import { NewsStream } from 'src/components/news/NewsStream';

interface Props {
    news: NewsDto[];
    categories: {
        category: CATEGORY;
        count: number;
    }[];
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
        return <NewsStream initialNews={this.props.news} />;
    }
}

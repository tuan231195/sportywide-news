import React from 'react';
import { NewsService } from 'src/services/news.service';
import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import { redirect } from 'src/utils/navigation/redirect';

interface Props {
    news: NewsDto[];
    container: ContainerInstance;
    category: string;
}

export default class CategoryPage extends React.Component<Props> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const category = ctx.query.category || '';
        if (!Object.values(CATEGORY).includes(category.toUpperCase())) {
            return redirect(ctx, '/404');
        }
        const news = await newsService.fetchNews({
            categories: [category],
        });

        return {
            news,
            category: ctx.query.category,
        };
    }
    render() {
        return (
            <NewsStream
                initialNewsList={this.props.news}
                loadFunc={(nextTimestamp) => {
                    const newsService = this.props.container.get(NewsService);
                    return newsService.fetchNews({
                        nextTimestamp,
                        categories: [this.props.category],
                    });
                }}
            />
        );
    }
}
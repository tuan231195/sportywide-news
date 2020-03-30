import React from 'react';
import { NewsService } from 'src/services/news.service';
import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';

interface Props {
    news: NewsDto[];
    categories: {
        category: CATEGORY;
        count: number;
    }[];
    container: ContainerInstance;
}

interface State {
    news: NewsDto[];
}
export default class IndexPage extends React.Component<Props, State> {
    static async getInitialProps(ctx) {
        const newsService = ctx.container.get(NewsService);
        const news = await newsService.fetchNews();

        return {
            news,
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            news: props.news,
        };
    }
    render() {
        return (
            <NewsStream
                newsList={this.state.news}
                loadFunc={async (nextTimestamp) => {
                    const newsService = this.props.container.get(NewsService);
                    const nextNews = await newsService.fetchNews(nextTimestamp);
                    if (nextNews.length) {
                        this.setState({
                            news: this.state.news.concat(nextNews),
                        });
                    }
                    return !!nextNews.length;
                }}
            />
        );
    }
}

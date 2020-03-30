import React from 'react';
import { NewsService } from 'src/services/news.service';
import { CATEGORY, NewsDto } from '@vdtn359/news-models';
import { NewsStream } from 'src/components/news/NewsStream';
import { SideBar } from 'src/components/common/Sidebar';
import { Grid } from 'semantic-ui-react';
import { NewsContainer } from 'src/components/common/Container.styled';

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
        const [news, categories] = await Promise.all([
            newsService.fetchNews(),
            newsService.fetchCategories(),
        ]);

        return {
            news,
            categories,
        };
    }
    render() {
        return (
            <NewsContainer>
                <Grid>
                    <Grid.Column mobile={16} tablet={4} computer={4}>
                        <SideBar categories={this.props.categories} />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={12} computer={12}>
                        <NewsStream initialNews={this.props.news} />
                    </Grid.Column>
                </Grid>
            </NewsContainer>
        );
    }
}

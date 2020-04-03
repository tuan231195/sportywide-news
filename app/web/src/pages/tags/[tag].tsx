import React from 'react';
import { NewsService } from 'src/services/news.service';
import { NewsDto } from '@vdtn359/news-models';
import { Header } from 'semantic-ui-react';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import { PaginationDto } from '@vdtn359/news-models/dist/dtos/pagination.dto';
import Router from 'next/router';
import styled from 'styled-components';
import { withRouter } from 'src/utils/hoc/with-router';
import { str } from '@vdtn359/news-utils';

interface Props {
    news: NewsDto[];
    router: typeof Router;
    tag: string;
    total: number;
    pagination: any;
    container: ContainerInstance;
}

interface State {
    pagination: PaginationDto;
    news: NewsDto[];
}

const Root = styled.div`
    margin-top: 20px;
`;

class SearchPage extends React.Component<Props, State> {
    static async getInitialProps(ctx) {
        const container = ctx.container;
        const newsService = container.get(NewsService);
        const { items: news, pagination } = await newsService.searchNews({
            search: ctx.query.tag,
        });

        return {
            news,
            tag: ctx.query.tag,
            total: pagination.total,
            pagination,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            pagination: props.pagination,
            news: props.news,
        };
    }

    async nextPage() {
        const newsService = this.props.container.get(NewsService);
        const { items: news, pagination } = await newsService.searchNews({
            search: this.props.tag,
            from: this.state.pagination.from + this.state.pagination.size,
            size: this.state.pagination.size,
        });

        return {
            news,
            pagination,
        };
    }

    render() {
        return (
            <Root>
                <Header as={'h3'}>
                    {this.props.total} document(s) matching tag &quot;
                    {str.ucfirst(this.props.tag)}&quot;
                </Header>
                <NewsStream
                    initialNewsList={this.state.news}
                    loadFunc={async () => {
                        const { news, pagination } = await this.nextPage();
                        this.setState({
                            pagination,
                        });
                        return news;
                    }}
                />
            </Root>
        );
    }
}

export default withRouter(SearchPage);

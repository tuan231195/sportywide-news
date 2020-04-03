import React from 'react';
import { NewsService } from 'src/services/news.service';
import { NewsDto } from '@vdtn359/news-models';
import { Header, Label } from 'semantic-ui-react';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
import { PaginationDto } from '@vdtn359/news-models/dist/dtos/pagination.dto';
import {
    getFilterFromUrl,
    SearchFilter,
    toQueryString,
} from 'src/utils/filter';
import Router from 'next/router';
import styled from 'styled-components';
import { withRouter } from 'src/utils/hoc/with-router';
import { SearchFilterOptions } from 'src/components/search/SearchFilter';
import { str } from '@vdtn359/news-utils';
import Link from 'next/link';

interface Props {
    news: NewsDto[];
    router: typeof Router;
    pagination: any;
    filter: SearchFilter;
    container: ContainerInstance;
}

interface State {
    pagination: PaginationDto;
    news: NewsDto[];
    terms: string[];
    filter: SearchFilter;
}

const Root = styled.div`
    margin-top: 20px;
`;

class SearchPage extends React.Component<Props, State> {
    static async getInitialProps(ctx) {
        const filter = getFilterFromUrl(ctx.query.filter);
        const { news, pagination, terms } = await SearchPage.newSearch(
            ctx.container,
            filter
        );

        return {
            filter,
            terms,
            news,
            pagination,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            pagination: props.pagination,
            news: props.news,
            terms: props.terms,
            filter: props.filter,
        };
    }

    async componentDidUpdate(prevProps) {
        const { query } = this.props.router;
        if (query.filter !== prevProps.router.query.filter) {
            const parsedFilter = getFilterFromUrl(query.filter);

            const { news, pagination, terms } = await SearchPage.newSearch(
                this.props.container,
                parsedFilter
            );
            this.setState({
                filter: parsedFilter,
                terms,
                news,
                pagination,
            });
        }
    }

    static async newSearch(container: ContainerInstance, filter: SearchFilter) {
        const newsService = container.get(NewsService);
        const { items: news, pagination, terms } = await newsService.searchNews(
            filter
        );

        return {
            news,
            terms,
            pagination,
        };
    }

    async nextPage() {
        const newsService = this.props.container.get(NewsService);
        const { items: news, pagination } = await newsService.searchNews({
            ...this.state.filter,
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
                    {this.state.pagination.total} news(s)
                    {!!this.state.filter.search && (
                        <span>
                            {' '}
                            for &quot;
                            {this.state.filter.search}&quot;
                        </span>
                    )}
                </Header>
                <SearchFilterOptions
                    filter={this.state.filter}
                    onFilterUpdate={(filter) => {
                        return this.props.router.push(
                            `/search?filter=${toQueryString(filter)}`,
                            undefined,
                            {
                                shallow: true,
                            }
                        );
                    }}
                />
                {!!this.state.terms.length && (
                    <div className={'vn-mt2 vn-mb2'}>
                        <Header as={'h5'}>Similar keywords:</Header>
                        <Label.Group>
                            {this.state.terms.map((term) => (
                                <Label color="teal" key={term}>
                                    <Link
                                        href={`/tags/[tag]`}
                                        as={`/tags/${term}`}
                                    >
                                        <a>{str.ucfirst(term)}</a>
                                    </Link>
                                </Label>
                            ))}
                        </Label.Group>
                    </div>
                )}
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

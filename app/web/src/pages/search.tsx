import React from 'react';
import { NewsSearchDto, NewsService } from 'src/services/news.service';
import { Header, Label } from 'semantic-ui-react';
import { NewsStream } from 'src/components/news/NewsStream';
import { ContainerInstance } from 'typedi';
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
import Head from 'next/head';

interface Props {
    news: NewsSearchDto[];
    router: typeof Router;
    total: number;
    filter: SearchFilter;
    container: ContainerInstance;
}

interface State {
    initialNewsList: NewsSearchDto[];
    terms: string[];
    filter: SearchFilter;
    total: number;
}

const Root = styled.div`
    margin-top: 20px;
`;

class SearchPage extends React.Component<Props, State> {
    private lastNewsList: NewsSearchDto[];

    static async getInitialProps(ctx) {
        const filter = getFilterFromUrl(ctx.query.filter);
        const { news, terms, total } = await SearchPage.newSearch(
            ctx.container,
            filter
        );

        return {
            filter,
            terms,
            news,
            total,
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            initialNewsList: props.news,
            terms: props.terms,
            filter: props.filter,
            total: props.total,
        };
        this.lastNewsList = props.news;
    }

    async componentDidUpdate(prevProps) {
        const { query } = this.props.router;
        if (query.filter !== prevProps.router.query.filter) {
            const parsedFilter = getFilterFromUrl(query.filter);

            const { news, terms, total } = await SearchPage.newSearch(
                this.props.container,
                parsedFilter
            );
            this.lastNewsList = news;
            this.setState({
                total,
                filter: parsedFilter,
                terms,
                initialNewsList: news,
            });
        }
    }

    static async newSearch(container: ContainerInstance, filter: SearchFilter) {
        const newsService = container.get(NewsService);
        const { items: news, terms, total } = await newsService.searchNews(
            filter
        );

        return {
            news,
            terms,
            total,
        };
    }

    async nextPage() {
        let news = [];
        if (this.lastNewsList.length) {
            const searchAfter = this.lastNewsList[this.lastNewsList.length - 1]
                .sort;
            const result = await SearchPage.newSearch(this.props.container, {
                ...this.state.filter,
                searchAfter,
            });
            news = result.news;
        }
        this.lastNewsList = news;

        return {
            news,
        };
    }

    render() {
        return (
            <Root>
                <Head>
                    <title>
                        {this.state.filter.search
                            ? `Search for ${this.state.filter.search}`
                            : 'Search'}
                    </title>
                </Head>
                <Header as={'h3'}>
                    {this.state.total} news(s)
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
                {!!this.state.terms?.length && (
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
                    initialNewsList={this.state.initialNewsList}
                    loadFunc={async () => {
                        const { news } = await this.nextPage();
                        return news;
                    }}
                />
            </Root>
        );
    }
}

export default withRouter(SearchPage);

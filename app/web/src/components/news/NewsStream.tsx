import React, { useState, useMemo, useEffect } from 'react';
import { NewsDto } from '@vdtn359/news-models';
import { Card } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { NewsCard } from 'src/components/news/NewsCard';
import { min } from 'lodash';
import { Spinner } from 'src/components/common/loading/Spinner';
import styled from 'styled-components';

const CardGroup = styled(Card.Group)`
    &&&& {
        margin: 0;
    }
`;

interface Props {
    initialNewsList: NewsDto[];
    loadFunc: (timestamp: number) => Promise<NewsDto[]>;
}
export const NewsStream: React.FC<Props> = ({
    initialNewsList = [],
    loadFunc,
}) => {
    const [hasMore, setHasMore] = useState(true);
    const [newsList, setNewsList] = useState(initialNewsList);
    useEffect(() => {
        setNewsList(initialNewsList);
        window.scrollTo(0, 0);
    }, [initialNewsList]);
    const nextTimestamp: number = useMemo(() => {
        return (
            min(newsList.map((news) => new Date(news.pubDate).getTime())) || 0
        );
    }, [newsList]);
    return (
        <CardGroup itemsPerRow={1} centered={true}>
            <InfiniteScroll
                pageStart={0}
                threshold={500}
                loadMore={() =>
                    loadFunc(nextTimestamp).then((nextNews) => {
                        if (nextNews.length) {
                            setNewsList(newsList.concat(nextNews));
                        }
                        setHasMore(!!nextNews.length);
                    })
                }
                hasMore={hasMore}
                loader={<Spinner key={-1} />}
                useWindow={true}
            >
                {newsList.map((news) => (
                    <NewsCard news={news} key={news.id} />
                ))}
            </InfiniteScroll>
        </CardGroup>
    );
};

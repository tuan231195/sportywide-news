import React, { useState, useMemo } from 'react';
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
    newsList: NewsDto[];
    loadFunc: (timestamp: number) => Promise<boolean>;
}
export const NewsStream: React.FC<Props> = ({ newsList, loadFunc }) => {
    const [hasMore, setHasMore] = useState(true);
    const nextTimestamp = useMemo(() => {
        return (
            min(newsList.map((news) => new Date(news.pubDate).getTime())) || 0
        );
    }, [newsList]);
    return (
        <CardGroup itemsPerRow={1} centered={true}>
            <InfiniteScroll
                pageStart={0}
                loadMore={() => loadFunc(nextTimestamp).then(setHasMore)}
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

import React, { useEffect, useState } from 'react';
import { NewsDto } from '@vdtn359/news-models';
import { Card } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { NewsCard } from 'src/components/news/NewsCard';
import { Spinner } from 'src/components/common/loading/Spinner';
import styled from 'styled-components';

const CardGroup = styled(Card.Group)`
    &&&& {
        margin: 0;
    }
`;

interface Props {
    initialNewsList: NewsDto[];
    loadFunc: (newsList?: NewsDto[]) => Promise<NewsDto[]>;
}
export const NewsStream: React.FC<Props> = ({
    initialNewsList = [],
    loadFunc,
}) => {
    const [hasMore, setHasMore] = useState(!!initialNewsList.length);
    const [newsList, setNewsList] = useState(initialNewsList);
    useEffect(() => {
        setNewsList(initialNewsList);
    }, [initialNewsList]);
    return (
        <CardGroup itemsPerRow={1} centered={true}>
            <InfiniteScroll
                pageStart={0}
                threshold={500}
                loadMore={() =>
                    loadFunc(newsList).then((nextNews) => {
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

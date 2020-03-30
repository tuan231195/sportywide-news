import React from 'react';
import { NewsDto } from '@vdtn359/news-models';
import { Card, Image, Button } from 'semantic-ui-react';
import { NewsCard } from 'src/components/news/NewsCard';

interface Props {
    initialNews: NewsDto[];
}
export const NewsStream: React.FC<Props> = ({ initialNews }) => {
    return (
        <Card.Group itemsPerRow={1} centered={true}>
            {initialNews.map((news) => (
                <NewsCard news={news} key={news.id} />
            ))}
        </Card.Group>
    );
};

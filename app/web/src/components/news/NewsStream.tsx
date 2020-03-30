import React from 'react';
import { NewsDto } from '@vdtn359/news-models';
import { Card, Image, Button } from 'semantic-ui-react';

interface Props {
    initialNews: NewsDto[];
}
export const NewsStream: React.FC<Props> = ({ initialNews }) => {
    return (
        <Card.Group itemsPerRow={1} centered={true}>
            {initialNews.map((news) => (
                <Card key={news.id} raised={true} fluid={true} centered={true}>
                    <Card.Content>
                        <Image size={'huge'} src={news.image} />
                        <Card.Header>{news.title}</Card.Header>
                        <Card.Meta>{news.category}</Card.Meta>
                        <Card.Description>{news.description}</Card.Description>
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    );
};

import React from 'react';
import styled from 'styled-components';
import { Card, Image } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';

interface Props {
    news: NewsDto;
}

const NewsImage = styled(Image)`
    &&&&& {
        object-fit: cover;
        height: 400px;
    }
`;
export const NewsCard: React.FC<Props> = ({ news }) => {
    return (
        <Card raised={true} fluid={true} centered={true}>
            <Card.Content>
                <NewsImage
                    size={'huge'}
                    src={news.image}
                    className={'vn-mb3'}
                />
                <Card.Header>{news.title}</Card.Header>
                <Card.Meta>{news.category}</Card.Meta>
                <Card.Description>{news.description}</Card.Description>
            </Card.Content>
        </Card>
    );
};

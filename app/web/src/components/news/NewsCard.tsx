import React from 'react';
import styled from 'styled-components';
import { Button, Card, Image } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';
import { date, str } from '@vdtn359/news-utils';
import Router from 'next/router';
import { useURL } from 'src/utils/hooks/basic';

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
    const { root: rootUrl, hostname } = useURL(news.url);
    return (
        <Card raised={true} fluid={true} centered={true}>
            <Card.Content>
                <NewsImage
                    size={'huge'}
                    src={news.image || '/static/images/placeholder.png'}
                    className={'vn-mb3'}
                />
                <Card.Header className={'vn-mb1'}>{news.title}</Card.Header>
                <Card.Meta>
                    <div className={'vn-flex vn-flex-justify'}>
                        <span>{str.ucfirst(news.category)}</span>
                        <span>
                            {date.formatDistance(
                                new Date(news.pubDate),
                                new Date()
                            )}
                        </span>
                    </div>
                </Card.Meta>
                <Card.Description>
                    <div className={'vn-mb3'}>{news.description}</div>
                    <span>
                        From:{' '}
                        <a
                            target={'_blank'}
                            rel={'noreferrer noopener'}
                            href={`${rootUrl}`}
                        >
                            {hostname}
                        </a>
                    </span>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className={'vn-flex vn-flex-justify vn-flex-center'}>
                    <Button
                        primary
                        onClick={() => {
                            return Router.push(
                                '/news/[slug]',
                                `/news/${news.slug}`
                            );
                        }}
                    >
                        {' '}
                        View More{' '}
                    </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

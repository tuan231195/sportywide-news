import React from 'react';
import styled from 'styled-components';
import { Button, Card, Image } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';
import { date, str } from '@vdtn359/news-utils';
import Link from 'next/link';
import { useURL } from 'src/utils/hooks/basic';

interface Props {
    news: NewsDto;
}

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    > a:not(:first-child) {
        margin-left: 10px;
    }
`;

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
                <Card.Header className={'vn-mb1'}>
                    <Link href={`/news/[slug]`} as={`/news/${news.slug}`}>
                        <a>{news.title}</a>
                    </Link>
                </Card.Header>
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
                    <div
                        className={'vn-mb3'}
                        dangerouslySetInnerHTML={{ __html: news.description }}
                    />
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
                <ButtonGroup>
                    <Link href={`/news/[slug]`} as={`/news/${news.slug}`}>
                        <a
                            className={'vn-raw-link ui button primary'}
                            style={{ color: 'white' }}
                        >
                            View More
                        </a>
                    </Link>
                    <Button
                        as={'a'}
                        href={news.url}
                        target={'_blank'}
                        rel={'noreferrer noopener'}
                    >
                        View External
                    </Button>
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
};

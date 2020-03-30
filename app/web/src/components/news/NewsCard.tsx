import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Card, Image, Button } from 'semantic-ui-react';
import { formatDistanceStrict } from 'date-fns';
import { NewsDto } from '@vdtn359/news-models';
import { str } from '@vdtn359/news-utils';

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
    const { host, protocol } = useMemo(() => {
        const url = new URL(news.url);
        return {
            host: url.hostname,
            protocol: url.protocol,
        };
    }, [news.url]);
    return (
        <Card raised={true} fluid={true} centered={true}>
            <Card.Content>
                <NewsImage
                    size={'huge'}
                    src={news.image}
                    className={'vn-mb3'}
                />
                <Card.Header className={'vn-mb1'}>{news.title}</Card.Header>
                <Card.Meta>
                    <div className={'vn-flex vn-flex-justify'}>
                        <span>{str.ucfirst(news.category)}</span>
                        <span>
                            {formatDistanceStrict(
                                new Date(news.pubDate),
                                new Date()
                            )}{' '}
                            ago
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
                            href={`${protocol}//${host}`}
                        >
                            {host}
                        </a>
                    </span>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className={'vn-flex vn-flex-justify vn-flex-center'}>
                    <Button primary> View More </Button>
                </div>
            </Card.Content>
        </Card>
    );
};

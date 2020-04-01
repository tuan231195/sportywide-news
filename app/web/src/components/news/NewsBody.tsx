import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';
import styled from 'styled-components';
import { date, str } from '@vdtn359/news-utils';
import { useURL } from 'src/utils/hooks/basic';

interface Props {
    news: NewsDto;
}

const NewsSegment = styled(Segment)`
    img {
        max-width: 100%;
        object-fit: cover;
    }
    padding: var(--space-3);
`;

const NewsHeader = styled(Header)`
    margin-bottom: var(--space-2);
`;

const NewsMeta = styled.div`
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: var(--space-2);
`;

const NewsSource = styled.div`
    margin-bottom: var(--space-1);
`;

const NewsLink = styled.a`
    text-decoration: none;
    margin-left: 10px;
    color: black;
`;

const NewsDescription = styled.i`
    margin-bottom: var(--space-3);
    display: block;
`;
export const NewsBody: React.FC<Props> = ({ news }) => {
    const { root: rootUrl, hostname } = useURL(news.url);
    console.log(useURL(news.url));
    return (
        <NewsSegment raised={true}>
            <NewsHeader as={'h1'}>
                {news.title}
                <NewsLink
                    href={news.url}
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                >
                    <Icon name={'external alternate'} />
                </NewsLink>
            </NewsHeader>
            <NewsMeta className={'vn-flex vn-flex-justify'}>
                <span>{str.ucfirst(news.category)}</span>
                <span>
                    {date.formatDistance(new Date(news.pubDate), new Date())}
                </span>
            </NewsMeta>
            <NewsSource>
                From:{' '}
                <a
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                    href={`${rootUrl}`}
                >
                    {hostname}
                </a>
            </NewsSource>
            <NewsDescription>{news.description}</NewsDescription>
            <div dangerouslySetInnerHTML={{ __html: news.body }} />
        </NewsSegment>
    );
};

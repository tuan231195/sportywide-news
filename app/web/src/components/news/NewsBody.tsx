import React from 'react';
import { Header, Icon, Segment, Image } from 'semantic-ui-react';
import { NewsDto } from '@vdtn359/news-models';
import styled from 'styled-components';
import Slider from 'react-slick';
import { date, str } from '@vdtn359/news-utils';
import { useURL } from 'src/utils/hooks/basic';

interface Props {
    news: NewsDto;
    similarNewsList: NewsDto[];
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
    margin-left: 15px;
    color: black;
    display: inline-block;
    transform: translateY(-4px);
`;

const NewsDescription = styled.i`
    margin-bottom: var(--space-3);
    display: block;
`;
export const NewsBody: React.FC<Props> = ({ news, similarNewsList }) => {
    const { root: rootUrl, hostname } = useURL(news.url);
    return (
        <NewsSegment raised={true}>
            <NewsHeader as={'h1'}>
                {news.title}
                <NewsLink
                    href={news.url}
                    target={'_blank'}
                    rel={'noreferrer noopener'}
                    data-tooltip={'View external'}
                    data-position="bottom center"
                >
                    <Icon name={'external alternate'} size={'small'} />
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
            {!!similarNewsList.length && (
                <>
                    <Header as={'h4'}>Similar News</Header>
                    <Slider
                        className={'vn-ml3 vn-mr3'}
                        dots={true}
                        infinite={true}
                        autoplay={false}
                        slidesToShow={2}
                        centerMode={true}
                        centerPadding={'60px'}
                        slidesToScroll={1}
                    >
                        {similarNewsList.map((news) => (
                            <Segment key={news.id}>
                                <Image
                                    size={'small'}
                                    src={
                                        news.image ||
                                        '/static/images/placeholder.png'
                                    }
                                />
                                <a>{news.title}</a>
                            </Segment>
                        ))}
                    </Slider>
                </>
            )}
            <div dangerouslySetInnerHTML={{ __html: news.body }} />
        </NewsSegment>
    );
};

import { NewsSearchDto } from 'src/services/news.service';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Image, List, Segment } from 'semantic-ui-react';

interface Props {
    query: string;
    items: NewsSearchDto[];
    onClick: Function;
}
const SearchSegment = styled(Segment)`
    &&&& {
        position: absolute;
        top: 100%;
        color: black;
        margin: 0;
        right: 0;
        left: 0;
        border-top: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
`;

const SearchResultItem = styled(List.Item)`
    &&&&&& a {
        display: flex;
        color: black;
        img {
            width: 120px;
            height: 90px;
            object-fit: cover;
        }

        .content {
            padding: 10px 15px;
            flex: 1 1 0;
            width: 0;
        }

        .header {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        span {
            overflow: hidden !important;
            text-overflow: ellipsis;
            overflow-wrap: break-word;
            word-wrap: break-word;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            max-height: 5em;
            line-height: 1.6em;
        }
    }
`;
export const SearchResults: React.FC<Props> = ({ query, items, onClick }) => {
    if (!query) {
        return null;
    }
    if (!items?.length) {
        return <SearchSegment>No results found</SearchSegment>;
    }
    return (
        <SearchSegment>
            <List divided>
                {items.map((item) => (
                    <SearchResultItem key={item.id} onClick={onClick}>
                        <Link href={`/news/[slug]`} as={`/news/${item.slug}`}>
                            <a className={'vn-raw-link'}>
                                <Image
                                    src={
                                        item.image ||
                                        '/static/images/placeholder.png'
                                    }
                                />
                                <List.Content>
                                    <List.Header>{item.title}</List.Header>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: item.description,
                                        }}
                                    />
                                </List.Content>
                            </a>
                        </Link>
                    </SearchResultItem>
                ))}
            </List>
        </SearchSegment>
    );
};

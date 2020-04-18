import React, { useState, useEffect } from 'react';
import { Comment, Header, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { CommentDto } from '@vdtn359/news-models';
import { date } from '@vdtn359/news-utils';
import { useUser } from 'src/auth/context';
import { NewsCommentReply } from 'src/components/news/NewsCommentReply';
import { useContainer } from 'src/utils/container/context';
import { NewsService } from 'src/services/news/news.service';

const NewsCommentSegment = styled(Segment)`
    &&& {
        padding: var(--space-2) var(--space-2);
    }
`;

interface Props {
    newsId: string;
}

export const NewsComments: React.FC<Props> = ({ newsId }) => {
    const user = useUser();
    const container = useContainer();
    const newsService = container.get(NewsService);
    const [comments, setComments] = useState<CommentDto[]>([]);
    if (!user) {
        return null;
    }
    useEffect(() => {
        (async () => {
            setComments(await newsService.getComments(newsId));
        })();
    }, [newsId]);
    return (
        <NewsCommentSegment>
            <Header as="h3">Comments</Header>

            {!!comments.length && (
                <Comment.Group>
                    {comments.map((comment, index) => (
                        <Comment key={index}>
                            <Comment.Avatar src={comment.avatar} />
                            <Comment.Content>
                                <Comment.Author as="a">
                                    {comment.author}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>
                                        {date.formatDistance(
                                            new Date(comment.time),
                                            new Date()
                                        )}
                                    </div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.content}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            )}

            {user && (
                <NewsCommentReply
                    newsId={newsId}
                    onNewComment={(newComment) => {
                        setComments(comments.concat(newComment));
                    }}
                />
            )}
        </NewsCommentSegment>
    );
};

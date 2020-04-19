import { NextApiResponse } from 'next';
import { Container } from 'typedi';
import createError from 'http-errors';
import { ApiRequest, getHandler } from 'src/api/handler';
import { CommentService } from 'src/services/news/comment.service';
import { authenticated } from 'src/api/authenticated';
import { stringQuery } from 'src/api/parse';

const handler = getHandler();
handler.use(authenticated);
handler.delete(deleteRequest);

export default handler;

async function deleteRequest(req: ApiRequest, res: NextApiResponse) {
    const id = stringQuery(req.query.id);
    if (!id) {
        throw new createError.BadRequest('Comment id is required');
    }
    const commentService = Container.get(CommentService);
    await commentService.deleteComment(id);
    res.json({ message: 'ok' });
}

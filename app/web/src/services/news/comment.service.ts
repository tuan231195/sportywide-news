import 'reflect-metadata';
import { Inject, Service } from 'typedi';
import { CommentDao } from '@vdtn359/news-schema';
import { DbService } from 'src/services/db.service';
import { CommentInputDto } from '@vdtn359/news-models';

@Service()
export class CommentService {
	private readonly commentDao: CommentDao;
	constructor(
		@Inject(() => DbService) private readonly dbService: DbService
	) {
		this.commentDao = new CommentDao(dbService.getDB());
	}

	addComment(commentDto: CommentInputDto) {
		return this.commentDao.saveOne(commentDto);
	}

	getComments(newsId: string) {
		return this.commentDao.query({
			newsId,
		});
	}

	deleteComment(id: string) {
		return this.commentDao.delete(id);
	}
}

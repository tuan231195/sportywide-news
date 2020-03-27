import { NewsDto } from '@vdtn359/news-models';
import { connect, News } from '@vdtn359/news-schema';
import config from 'config';
import { process, date } from '@vdtn359/news-utils';

const sequelize = connect({
	username: config.get('db.username'),
	password: config.get('db.password'),
	database: 'news',
});

const newsRepository = sequelize.getRepository(News);

export async function saveNews(newsDtos: NewsDto[]) {
	const batcher = process.batch(newsDtos, 10);
	await batcher(async (dtos) => {
		const newsModels: Partial<News>[] = dtos.map((newsDto) => ({
			category: newsDto.category,
			id: newsDto.guid,
			description: newsDto.description,
			image: newsDto.image?.imageUrl,
			title: newsDto.title,
			feed: newsDto.feed,
			pubDate: newsDto.pubDate,
			url: newsDto.url,
		}));
		await newsRepository.bulkCreate(newsModels, {
			updateOnDuplicate: ['description', 'image', 'title', 'pubDate'],
		});
	});
}

export function cleanup(): Promise<void> {
	return sequelize.close();
}

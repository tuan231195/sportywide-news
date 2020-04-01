import { BaseModel } from 'src/models/base.model';
import { Table, Column, AllowNull, DataType } from 'sequelize-typescript';
import { CATEGORY } from '@vdtn359/news-models';

@Table({
	timestamps: true,
	tableName: 'news',
})
export class News extends BaseModel<News> {
	@Column(
		DataType.ENUM(
			'SPORT',
			'NATIONAL',
			'WORLD',
			'LIFESTYLE',
			'TRAVEL',
			'ENTERTAINMENT',
			'TECHNOLOGY',
			'BUSINESS'
		)
	)
	category: CATEGORY;

	@Column
	url: string;

	@Column
	slug: string;

	@AllowNull
	@Column
	image?: string;

	@Column
	title: string;

	@Column(DataType.DATE)
	pubDate: Date;

	@Column
	description: string;

	@Column
	feed: string;
}

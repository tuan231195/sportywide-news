export enum CATEGORY {
	SPORT = 'SPORT',
	NATIONAL = 'NATIONAL',
	WORLD = 'WORLD',
	LIFESTYLE = 'LIFESTYLE',
	TRAVEL = 'TRAVEL',
	ENTERTAINMENT = 'ENTERTAINMENT',
	TECHNOLOGY = 'TECHNOLOGY',
	BUSINESS = 'BUSINESS',
}
export class NewsDto {
	id: string;
	category: CATEGORY;
	url: string;
	image?: string;
	title: string;
	pubDate: Date;
	description: string;
	feed?: string;
	body?: string;
}

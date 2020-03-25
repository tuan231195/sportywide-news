export class NewsImageDto {
	imageUrl: string;
	imageDesc?: string;
}

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
	guid: string;
	category: CATEGORY;
	url: string;
	image: NewsImageDto | null;
	title: string;
	pubDate: Date;
	description: string;
	feed?: string;
}

export enum ACTION_TYPE {
	SEARCH = 'search',
	RATE = 'rate',
	VIEW = 'view',
}

export class NewsStatDto {
	type: ACTION_TYPE;
	docIds: string[];
	term?: string;
	time: Date;
	num?: number;
}

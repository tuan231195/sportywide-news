export interface CommentDto {
	avatar: string;
	author: string;
	content: string;
	time: Date;
	newsId: string;
	id: string;
}

export interface CommentInputDto {
	userId: string;
	content: string;
	time: Date;
	newsId: string;
	id?: string;
}

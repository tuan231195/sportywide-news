import { PrimaryKey, CreatedAt, UpdatedAt, Model } from 'sequelize-typescript';

export class BaseModel<T> extends Model<T> {
	@PrimaryKey
	id: string;

	@CreatedAt
	createdAt: Date;

	@UpdatedAt
	updatedAt: Date;
}

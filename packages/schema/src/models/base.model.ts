import {
	Column,
	CreatedAt,
	Model,
	PrimaryKey,
	UpdatedAt,
} from 'sequelize-typescript';

export class BaseModel<T> extends Model<T> {
	@PrimaryKey
	@Column
	id: string;

	@Column
	@CreatedAt
	createdAt: Date;

	@Column
	@UpdatedAt
	updatedAt: Date;
}

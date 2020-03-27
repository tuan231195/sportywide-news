import {
	PrimaryKey,
	CreatedAt,
	UpdatedAt,
	Model,
	Column,
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

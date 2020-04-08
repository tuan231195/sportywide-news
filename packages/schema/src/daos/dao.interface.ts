export interface Dao<T> {
	save(items: T[]): Promise<void>;

	saveOne(id: string): Promise<void>;

	findByIds(itemIds: string[]): Promise<T[]>;
}

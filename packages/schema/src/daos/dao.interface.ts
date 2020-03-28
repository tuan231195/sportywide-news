export interface Dao<T> {
	save(items: any[]);

	findByIds(itemIds: string[]): Promise<T[]>;
}

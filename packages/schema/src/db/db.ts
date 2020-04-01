import { Sequelize } from 'sequelize-typescript';
import QueryStream from 'pg-query-stream';
import { Observable } from 'rxjs';
import { stream } from '@vdtn359/news-core';

export type DB = DBWrapper & Sequelize;

export class DBWrapper {
	private connectionManager: any;
	constructor(private readonly sequelize: Sequelize) {
		this.connectionManager = this.sequelize.connectionManager;
	}

	async stream(query, batchSize = 10000): Promise<Observable<any>> {
		const connection: any = await this.connectionManager.getConnection({
			type: 'read',
		});
		const rowStream = connection.query(
			new QueryStream(query, undefined, {
				batchSize,
			})
		);
		rowStream.on('end', () => {
			this.connectionManager.releaseConnection(connection);
		});
		return stream.fromStream(rowStream);
	}

	async hasColumn(tableName, columnName) {
		const columns = await this.sequelize
			.getQueryInterface()
			.describeTable(tableName);
		return !!columns[columnName];
	}
}

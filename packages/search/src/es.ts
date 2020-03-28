import { Client } from '@elastic/elasticsearch';

export type Elasticsearch = ElasticsearchWrapper & Client;
export class ElasticsearchWrapper {
	constructor(private readonly client: Client) {}

	createIndex(index: string, mappings) {
		return this.client.indices.create({
			index,
			body: {
				mappings,
			},
		});
	}

	async hasIndex(index: string) {
		const { body: exists } = await this.client.indices.exists({
			index,
		});
		return exists;
	}
}

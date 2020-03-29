import { Client } from '@elastic/elasticsearch';
import { flatMap } from 'lodash';

export type Elasticsearch = ElasticsearchWrapper & Client;
export class ElasticsearchWrapper {
	constructor(private readonly client: Client) {}

	async createIndex(index: string, mappings) {
		try {
			await this.client.indices.create({
				index,
				body: {
					mappings,
				},
			});
		} catch (e) {
			if (e.message !== 'resource_already_exists_exception') {
				throw e;
			}
		}
	}

	async hasIndex(index: string) {
		const { body: exists } = await this.client.indices.exists({
			index,
		});
		return exists;
	}

	async hasDocument(index: string, documentId: string) {
		const { body: exists } = await this.client.exists({
			index,
			id: documentId,
		});
		return exists;
	}

	async bulkUpsert(index: string, documents) {
		return this.client.bulk({
			body: flatMap(
				documents.map((document) => [
					{
						update: { _index: index, _id: document.id },
					},
					// eslint-disable-next-line @typescript-eslint/camelcase
					{ doc: document, doc_as_upsert: true },
				])
			),
		});
	}
}

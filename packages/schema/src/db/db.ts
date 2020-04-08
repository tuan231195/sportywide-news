import { Observable, Subject } from 'rxjs';
import firebase from 'firebase-admin';
import { last, omitBy, isNil } from 'lodash';

export type DB = DBWrapper & firebase.firestore.Firestore;

export class DBWrapper {
	constructor(private readonly firestore: firebase.firestore.Firestore) {}

	stream(collection, batchSize = 100): Observable<any> {
		const subject = new Subject();

		this.internalStream(subject, collection, batchSize);
		return subject;
	}

	async saveOne(collection: string, item: any): Promise<void> {
		await this.firestore
			.collection(collection)
			.doc(item.id)
			.set(this.cleanItem(item));
	}

	async save(collection: string, items: any[]): Promise<void> {
		const batch = this.firestore.batch();

		for (const item of items) {
			const ref = this.firestore.collection(collection).doc(item.id);
			batch.set(ref, this.cleanItem(item));
		}
		await batch.commit();
	}

	async findByIds(collection: string, ids: string[]): Promise<any[]> {
		const snapshots = await this.firestore
			.collection(collection)
			.where('id', 'in', ids)
			.get();
		return snapshots.docs.map((doc) => doc.data());
	}

	private cleanItem(item) {
		return omitBy(item, isNil);
	}

	private async internalStream(
		subject: Subject<any>,
		collection: string,
		batchSize: number
	) {
		let current = this.firestore
			.collection(collection)
			.orderBy('id')
			.limit(batchSize);

		while (true) {
			const snapshot = await current.get();
			if (!snapshot.docs.length) {
				subject.complete();
				return;
			}
			for (const doc of snapshot.docs) {
				subject.next(doc.data());
			}
			const lastDocument = last(snapshot.docs);

			current = this.firestore
				.collection(collection)
				.orderBy('id')
				.startAfter(lastDocument.data().id)
				.limit(batchSize);
		}
	}
}

import { Observable, Subject } from 'rxjs';
import firebase from 'firebase-admin';
import { last, omitBy, isNil } from 'lodash';
import { str } from '@vdtn359/news-utils';

export type DB = DBWrapper & firebase.firestore.Firestore;

export class DBWrapper {
	constructor(private readonly firestore: firebase.firestore.Firestore) {}

	stream(collection, batchSize = 100): Observable<any> {
		const subject = new Subject();

		this.internalStream(subject, collection, batchSize);
		return subject;
	}

	async saveOne(collection: string, item: any): Promise<any> {
		const id = DBWrapper.id(item.id);
		await this.firestore
			.collection(collection)
			.doc(id)
			.set(DBWrapper.cleanItem(item));
		return this.get(collection, id);
	}

	async save(collection: string, items: any[]): Promise<void> {
		const batch = this.firestore.batch();

		for (const item of items) {
			const ref = this.firestore
				.collection(collection)
				.doc(DBWrapper.id(item.id));
			batch.set(ref, DBWrapper.cleanItem(item));
		}
		await batch.commit();
	}

	async findByIds(collection: string, ids: string[]): Promise<any[]> {
		const snapshots = await this.firestore
			.collection(collection)
			.where(firebase.firestore.FieldPath.documentId(), 'in', ids)
			.get();
		return snapshots.docs.map((doc) => DBWrapper.getObject(doc.data()));
	}

	async get(collection: string, id: string): Promise<any> {
		const snapshot = await this.firestore
			.collection(collection)
			.doc(id)
			.get();
		return DBWrapper.getObject(snapshot.data());
	}

	async query(
		collection: string,
		where: Record<string, any>
	): Promise<any[]> {
		const collectionRef = this.firestore.collection(collection);
		for (const [key, value] of Object.entries(where)) {
			let op;
			if (Array.isArray(value)) {
				op = 'in';
			} else {
				op = '=';
			}
			collectionRef.where(key, op, value);
		}
		const snapshots = await collectionRef.get();
		return snapshots.docs.map((doc) => DBWrapper.getObject(doc.data()));
	}

	async delete(collection: string, id: string): Promise<void> {
		await this.firestore.collection(collection).doc(id).delete();
	}

	private static cleanItem(item) {
		return omitBy(item, isNil);
	}

	private static id(newId) {
		return newId || str.uuid();
	}

	private static getObject(item) {
		for (const key of Object.keys(item)) {
			if (item[key] instanceof firebase.firestore.Timestamp) {
				item[key] = item[key].toDate();
			}
		}
		return item;
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
			const lastDocument: any = last(snapshot.docs);

			current = this.firestore
				.collection(collection)
				.orderBy('id')
				.startAfter(lastDocument.data().id)
				.limit(batchSize);
		}
	}
}

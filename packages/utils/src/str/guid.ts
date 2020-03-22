import uuidByString from 'uuid-by-string';

export function toGuid(str): string {
	return uuidByString(str).replace(/-/g, '');
}

export function stringQuery(queryParams: string | string[]): string {
	if (Array.isArray(queryParams)) {
		return queryParams[0];
	} else {
		return queryParams;
	}
}

export function arrayQuery(queryParams: string | string[]): string[] {
	if (Array.isArray(queryParams)) {
		return queryParams;
	} else if (queryParams) {
		return [queryParams];
	}
}

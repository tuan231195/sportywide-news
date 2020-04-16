import { useCallback, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { useEffectOnce } from 'src/utils/hooks/basic';

export function useSearch(processor: (str: string) => any): any {
	const subject = useRef<BehaviorSubject<string>>(new BehaviorSubject(''));
	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(false);
	useEffectOnce(() => {
		subject.current
			.pipe(
				distinctUntilChanged(),
				debounceTime(700),
				switchMap(async (search) => {
					if (search.length < 3) {
						return null;
					}
					setLoading(true);
					try {
						return await processor(search);
					} finally {
						setLoading(false);
					}
				})
			)
			.subscribe((result) => {
				setResults(result);
			});
	});
	const changeSearch = useCallback((str) => subject.current.next(str), [
		subject,
	]);
	return [{ results, loading }, changeSearch];
}

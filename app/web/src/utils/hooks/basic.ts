import {
	useEffect,
	useCallback,
	EffectCallback,
	useRef,
	useState,
	useMemo,
} from 'react';

export function useEffectOnce(effect: EffectCallback) {
	useEffect(effect, []);
}

export function useStateRef<T>(initialValue: T): [() => T, Function] {
	const [state, setState] = useState<T>(initialValue);
	const ref = useRef(state);
	ref.current = state;
	const getValue = useCallback(() => ref.current, []);
	return [getValue, setState];
}

export function useURL(urlStr) {
	const url = useMemo(() => {
		return new URL(urlStr);
	}, [urlStr]);

	return {
		root: `${url.protocol}//${url.hostname}`,
		hostname: url.hostname,
	};
}

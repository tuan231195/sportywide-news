import {
	useEffect,
	useCallback,
	EffectCallback,
	useRef,
	useState,
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

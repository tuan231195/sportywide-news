import * as React from 'react';
import ReactLazyLoad from 'react-lazyload';

export function LazyLoad(props: {
    config: {
        once?: boolean;
        height?: number;
        offset?: number;
    };
    children: any;
    noLazyLoad?: boolean;
}) {
    if (props.noLazyLoad) {
        return props.children;
    }
    return <ReactLazyLoad {...props.config}>{props.children}</ReactLazyLoad>;
}

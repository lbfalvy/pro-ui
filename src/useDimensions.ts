import React from "react";
import { upCastRef } from "./utils";

export interface Dimensions {
    left: number, right: number,
    top: number, bottom: number,
    x: number, y: number,
    width: number, height: number
}

const defaultDimensions: Dimensions = {
    left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0, width: 0, height: 0
}
const defaultDimensionsString = JSON.stringify(defaultDimensions);

export function useDimensions<T extends HTMLElement>(log = false): [React.Ref<T>, Dimensions, boolean] {
    const ref = React.useRef<T>(null);
    const watcher = React.useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = React.useState<string>(defaultDimensionsString);
    // This tiny div tracks the top left corner of the element
    React.useLayoutEffect(() => {
        if (!ref.current) return;
        watcher.current = document.createElement('div');
        watcher.current.style.position = 'fixed';
        watcher.current.style.width = '2px';
        watcher.current.style.height = '2px';
        ref.current.append(watcher.current);
        return () => watcher.current?.remove();
    }, [ref.current]);
    const recalculate = React.useCallback(() => {
        if (!watcher.current || !ref.current) return;
        const data = ref.current.getBoundingClientRect();
        watcher.current.style.top = `${data.top-1}px`;
        watcher.current.style.left = `${data.left-1}px`;
        if (log) {
            console.log('Dimensions', data, '\n', 'WatcherDimensions', watcher.current.getBoundingClientRect());
        }
        if (data) setDimensions(JSON.stringify(data));
    }, [ref.current, watcher.current]);
    React.useEffect(() => {
        if (!ref.current) return;
        recalculate();
        const resize = new ResizeObserver(recalculate);
        resize.observe(ref.current);
        if (log) console.log('Resize observer', resize);
        return () => {
            resize.disconnect();
            if (log) console.log('Cleaning up resize observer');
        }
    }, [ref.current, recalculate]);
    React.useEffect(() => {
        if (!watcher.current) return;
        // Detect resizing the watcher
        const resize = new ResizeObserver(recalculate);
        resize.observe(watcher.current);
        // Detect movement
        const move = new IntersectionObserver(ev => {
            if (log) console.log('Move detected', ev, ref.current);
            if (Math.abs(ev[0].intersectionRatio - 0.25) > 0.0001) return;
            recalculate();
        }, { root: ref.current });
        move.observe(watcher.current);
        if (log) console.log('Intersection observer', move, resize);
        return () => {
            resize.disconnect();
            move.disconnect();
            if (log) console.log('Cleaning up intersection observer');
        }
    })
    const ret = React.useMemo(() => JSON.parse(dimensions), [dimensions]);
    return [upCastRef(ref), ret, ret.width > 0 && ret.height > 0];
}
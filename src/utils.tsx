import React, { useLayoutEffect } from "react";
import { XYCoord } from "react-dnd";

export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export function classList(classes: Record<string, boolean>): string {
    return Object
        .entries(classes)
        .filter(entry => entry[1])
        .map(entry => entry[0])
        .join(' ');
}

export function upCastRef<T, U extends T>(ref: React.Ref<T>): (u: U | null) => void {
    return (u: U | null) => {
        if (typeof ref === 'function') {
            ref(u);
        } else if (ref) {
            const writableRef = ref as Writable<React.RefObject<T>>;
            writableRef.current = u;
        }
    };
}

export function mergeRefs<T, U extends T>(...refs: React.Ref<T>[]): React.Ref<U> {
    const filteredRefs = refs.filter(Boolean);
    if (!filteredRefs.length) return null;
    if (filteredRefs.length === 0) return upCastRef<T, U>(filteredRefs[0]);
    const upcasts: ((u: U | null) => void)[] = refs.map(upCastRef);
    return inst => {
        for (const ref of upcasts) ref(inst); 
    };
};

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

export function useDimensions<T extends HTMLElement>(): [React.Ref<T>, Dimensions, boolean] {
    const ref = React.useRef<T>();
    const [dimensions, setDimensions] = React.useState<string>(defaultDimensionsString);
    const recalculate = React.useCallback(() => {
        const data = ref.current?.getBoundingClientRect();
        if (data) setDimensions(JSON.stringify(data));
    }, [ref.current]);
    useLayoutEffect(() => {
        recalculate();
        const observer = new ResizeObserver(recalculate);
        if (!ref.current) return;
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref.current, recalculate]);
    const ret = React.useMemo(() => {
        return JSON.parse(dimensions)
    }, [dimensions]);
    return [upCastRef(ref), ret, ret.width > 0 && ret.height > 0];
}

function mouseMoveListener(ev: MouseEvent) {
    mousePosition.now = Date.now();
    mousePosition.x = ev.clientX;
    mousePosition.y = ev.clientY;
}

export const mousePosition = { x: 0, y: 0, now: 0 };
let mouseWatchers = 0;
export function usePointer(): () => { x: number, y: number } {
    React.useEffect(() => {
        if (mouseWatchers++ == 0) {
            window.addEventListener('mousemove', mouseMoveListener);
        }
        return () => {
            if (--mouseWatchers == 0) {
                window.removeEventListener('mousemove', mouseMoveListener);
            }
        };
    }, []);
    return () => mousePosition;
}

export function constrain(lower: number, value: number, upper: number) {
    // If the constraints cannot be satisfied, always return their average
    if (upper < lower) return (upper + lower) / 2;
    return Math.max(lower, Math.min(value, upper));
}

export function sum<T>(arr: ReadonlyArray<T>, predicate: (t: T) => number): number
export function sum(arr: ReadonlyArray<number>): number
export function sum<T>(
    arr: ReadonlyArray<T>,
    predicate: (t: T) => number = t => t as unknown as number
): number {
    return arr.reduce((a, b) => a + predicate(b), 0);
}

export function maxIndex<T>(arr: ReadonlyArray<T>, predicate: (t: T) => number): number
export function maxIndex(arr: ReadonlyArray<number>): number
export function maxIndex<T>(
    arr: ReadonlyArray<T>,
    predicate: (t: T) => number = t => t as unknown as number
): number {
    return arr.reduce(
        (a, b, i) => a[0] > predicate(b) ? a : [predicate(b), i], 
        [Number.NEGATIVE_INFINITY, -1]
    )[1];
}

export function negXY(a: XYCoord): XYCoord;
export function negXY(a: XYCoord | null): XYCoord | null;
export function negXY(a: XYCoord | null): XYCoord | null {
    return a ? { x: -a.x, y: -a.y } : null;
}
export function addXY(a: XYCoord, b: XYCoord): XYCoord;
export function addXY(a: XYCoord | null, b: XYCoord | null): XYCoord | null;
export function addXY(a: XYCoord | null, b: XYCoord | null): XYCoord | null {
    return a && b ? {
        x: a.x + b.x,
        y: a.y + b.y
    } : null;
}
export function subXY(a: XYCoord, b: XYCoord): XYCoord;
export function subXY(a: XYCoord | null, b: XYCoord | null): XYCoord | null;
export function subXY(a: XYCoord | null, b: XYCoord | null): XYCoord | null {
    return addXY(a, negXY(b));
}
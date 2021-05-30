import React, { useLayoutEffect } from "react";
import { XYCoord } from "react-dnd";
import { ID } from "./types";

export type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Removes and returns the item with the given ID from the collection. Use this
 * to retrieve the dragged tab and insert it in the new location with a simple
 * `data.splice(0, tab)` to execute a tab drag action.
 * @category Tabs
 * @param array Tabs state
 * @param id Tab to be removed
 * @returns The removed tab
 */
export function removeItem<T extends { id: ID }>(array: T[], id: ID): T | undefined {
    return array.splice(array.findIndex(el => el.id === id), 1)[0]
}

/**
 * Decide whether each class gets applied with a simple boolean expression
 * @param classes An array of strings, arrays of strings. The set of
 * allowed symbols was composed specifically to exclude the old syntax
 * @returns A composed class list string
 */
export function classList(...classes: (
    string | boolean | undefined | null | (() => unknown) | Symbol | unknown[]
)[]): string {
    return classes.flat().filter(c => typeof c == 'string').join(' ')
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

/**
 * Make all provided refs follow the value of the returned ref
 * @param refs tracking refs
 * @returns master ref
 */
export function mergeRefs<T, U extends T>(...refs: React.Ref<T>[]): React.Ref<U> {
    const filteredRefs = refs.filter(Boolean);
    if (!filteredRefs.length) return null;
    if (filteredRefs.length === 0) return upCastRef<T, U>(filteredRefs[0]);
    const upcasts: ((u: U | null) => void)[] = refs.map(upCastRef);
    return inst => {
        for (const ref of upcasts) ref(inst); 
    };
};

/**
 * Get the window dimensions in pixels whenever it changes.
 * @returns Size of the window in pixels
 */
export function useWindowDimensions(): [number, number] {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const recalculate = React.useCallback(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);
    useLayoutEffect(() => {
        recalculate();
        window.addEventListener('resize', recalculate);
        return () => window.removeEventListener('resize', recalculate);
    }, [recalculate]);
    return [width, height];
}

function mouseMoveListener(ev: MouseEvent) {
    mousePosition.now = Date.now();
    mousePosition.x = ev.clientX;
    mousePosition.y = ev.clientY;
}

export const mousePosition = { x: 0, y: 0, now: 0 };
let mouseWatchers = 0;

/**
 * Keep track of the mouse pointer, ref style.
 * @returns A function that always returns the corrent mouse position
 */
export function usePointer(): { x: number, y: number } {
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
    return mousePosition;
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
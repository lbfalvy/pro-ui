import React, { ReactNode } from "react";
import { XYCoord } from "react-dnd";

export type Side = 'top' | 'left' | 'bottom' | 'right';
export type Axis = 'y' | 'x';
export type ResizeHandler = (path: number[], after: number, amount: number) => void;
export type SplitHandler<I, K> = (path: number[], side: Side, item: I, type: K) => void;
// Generated with util/create-component.js
export interface SplitsProps<K extends string, I = {}> {
    onResize?: ResizeHandler
    onSplit?: SplitHandler<I, K>
    splitTypes?: K[] | K
    minSize?: number
    children: SplitSubdata<React.ReactNode>;
}

export interface SplitChild<T = React.ReactNode> {
    ratio: number
    content: SplitData<T> | T
}

/* The TYPE_ID field is required because we need to identify SplitData among
other types, and we need to do so even through Immer drafts, which break  'in',
'instanceof' and 'typeof' */
export interface SplitData<T = React.ReactNode> {
    TYPE_ID: 'SplitData'
    axis: Axis
    children: SplitChild<T>[]
}

export interface ResizeItem {
    width: number,
    height: number,
    start: XYCoord,
    position?: XYCoord
    axis: Axis
}

export type SplitSubdata<T> = SplitChild<T>['content'];
export type SplitSubdataFunction<T, U extends SplitSubdata<T>> = (
    c: SplitSubdata<T>
) => U ;
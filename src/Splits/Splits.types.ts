import React from "react";
import { XYCoord } from "react-dnd";
import { TabData } from "../Tabs";
import { Axis, ID, Side } from "../types";

/**
 * Parameters to the {@link Splits} component
 * @template T type of the split items (drag data) we might receive
 * @category Splits
 */
export interface SplitsProps<T = {}> {

    /**
     * Called when a cell is resized. You should pass the arguments as they are
     * to {@link resizeSplit} and then call {@link fixSplitSizes} to eliminate
     * negative sizes or other problems.
     */
    onResize?: (path: number[], after: number, amount: number) => void;

    /**
     * Called when an item of a known type is dragged onto a split drop area.
     * Pass the arguments as they are to {@link subdivideSplit} and then call
     * {@link fixSplitTree} to normalise topology and {@link fixSplitSizes} to
     * avoid negative sizes and similar issues.
     */
    onSplit?: (path: number[], side: Side, item: T, type: string) => void;

    /**
     * Will handle react-dnd drops for these item types.
     */
    splitTypes?: string[] | string

    /**
     * The minimum allowed size of a split. Smaller splits than this will grow
     * up to the smaller of this limit or their equal fraction of the
     * container.
     */
    minSize?: number

    /**
     * The split data tree which might only consist of a single leaf.
     */
    children: SplitChild<React.ReactNode>['content'];
}

/**
 * Describes a slot in a split container
 * @template T type of leaves
 * @category Splits
 */
export interface SplitChild<T = React.ReactNode> {

    /** Relative size of this split */
    ratio: number

    /** Contents of this split */
    content: SplitData<T> | T
}

/**
 * Describes a node in the split tree. Do not implement this interface
 * yourself, use {@link getSplitData} to obtain an instance.
 * @template T type of leaves
 * @category Splits
 */
export interface SplitData<T = React.ReactNode> {
    /** @ignore used by {@link isSplitData} */
    TYPE_ID: 'SplitData'

    /** Whether to lay out the items horizontally (x) or vertically (y). */
    axis: Axis

    /** Subcontainers or sub-elements, and their respective ratios. */
    children: SplitChild<T>[]
}

/**
 * Properties to the {@link TabSplits} component
 * @category TabSplits
 */
export interface TabSplitsProps {

    /**
     * Called when a cell is resized. You should pass the arguments as they are
     * to {@link resizeSplit} and then call {@link fixSplitSizes} to eliminate
     * negative sizes or other problems.
     */
    onResize?: (path: number[], after: number, amount: number) => void;

    /**
     * Called when a tab is dropped on a split drop area. Pass the arguments as
     * they are to {@link splitWithTab}, then call {@link fixSplitSizes} to
     * avoid negative sizes and similar issues.
     */
    onSplit?: (path: number[], side: Side, id: ID, from: number[]) => void;

    /**
     * Called when a tab is dropped on this container. Pass the arguments as
     * they are to {@link moveTab}.
     */
    onMove?: (to: number[], index: number, id: ID, from: number[]) => void

    /**
     * The minimum allowed size of a split. Smaller splits than this will grow
     * up to the smaller of this limit or their equal fraction of the
     * container.
     */
    minSize?: number

    /**
     * The split data tree which might only consist of a single leaf.
     */
    children: SplitChild<TabData<number[]>[]>['content'];
}

export interface ResizeItem {
    width: number,
    height: number,
    start: XYCoord,
    position?: XYCoord
    axis: Axis
}
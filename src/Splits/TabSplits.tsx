import produce from "immer";
import React from "react";
import Tabs, { removeTab, TabData } from "../Tabs";
import { TabDrag } from "../Tabs/Tabs.types";
import { ID, Side } from "../types";
import { editSplitData, subdivideSplit, transposeSplitTree, traverseSplitTree } from "./editSplitData";
import { fixSplitTree } from "./fixSplitData";
import Splits, { isSplitData } from "./Splits";
import { SplitData, TabSplitsProps } from "./Splits.types";
import SplitsLayer from "./SplitsLayer";

/**
 * Moves a tab to a different leaf
 * @category TabSplits
 * @param data 
 * @param to Target path
 * @param insert Index to insert at
 * @param id 
 * @param from Source path
 * @returns 
 */
export function moveTab(
    data: TabData<number[]>[] | SplitData<TabData<number[]>[]>,
    to: number[], insert: number, id: string|number,
    from: number[]
): TabData<number[]>[] | SplitData<TabData<number[]>[]> {
    data = produce(data, draft => {
        const tabs = traverseSplitTree(draft, from);
        if (isSplitData(tabs)) throw new Error('Source not a leaf');
        const item = removeTab(tabs, id);
        if (!item) throw new Error('Tab not found');
        const target = traverseSplitTree(draft, to);
        if (isSplitData(target)) throw new Error('Target not a leaf');
        target.splice(insert, 0, item);
    });
    return fixSplitTree(data, cell => 0 < cell.length);
}

/**
 * Moves a tab to a brand new leaf created by splitting a container
 * @category TabSplits
 * @param data 
 * @param path Leaf to split
 * @param side Which side the new item goes
 * @param id ID of the moved tab
 * @param from Leaf the tab was moved from
 * @returns 
 */
export function splitWithTab(
    data: TabData<number[]>[] | SplitData<TabData<number[]>[]>,
    path: number[],
    side: Side,
    id: ID,
    from: number[]
): SplitData<TabData<number[]>[]> {
    let item: TabData<number[]> | undefined;
    data = editSplitData(data, from, leaf => {
        const newLeaf = [...leaf as TabData<number[]>[]];
        item = removeTab(newLeaf, id);
        return newLeaf;
    });
    if (item === undefined) throw new Error('Tab not found')
    data = subdivideSplit(data, path, side, [item]);
    return fixSplitTree(data, cell => 0 < cell.length);
}

/**
 * A component that combines {@link Tabs} and {@link Splits} into an easy to
 * use, ready-made package. With this and a reducer that calls the provided
 * utility functions, you can set up a functioning tabbed split view in a
 * matter of minutes.
 * @category TabSplits
 * @param param0
 * @returns 
 */
export function TabSplits({
    children, minSize, onResize, onSplit, onMove
}: TabSplitsProps): React.ReactElement {
    return <>
        <SplitsLayer/>
        <Splits<TabDrag<number[]>> minSize={minSize} splitTypes={'TAB'}
            onResize={onResize}
            onSplit={(path, side, { id, metadata }) => onSplit?.(path, side, id, metadata)}>
            {transposeSplitTree(children, null, (path, cell) => <>
                <Tabs<number[]> onMove={(...data) => onMove?.(path, ...data)}>
                    {cell}
                </Tabs>
            </>)}
        </Splits>
    </>
}
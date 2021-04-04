// Generated with util/create-component.js
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Splits, { getSplitData, isSplitData } from "./Splits";
import fixSplitSizes, { fixSplitTree } from './fixSplitData';
import { ResizeHandler, Side, SplitChild, SplitData, SplitHandler, SplitSubdata } from "./Splits.types";
import { upCastRef, useDimensions } from "../utils";
import SplitsLayer from './SplitsLayer';
import Tabs, { removeTab } from '../Tabs';
import { ID, TabData, TabDrag } from '../Tabs/Tabs.types';
import { editSplitData, subdivideSplit, resizeSplit, traverseSplitTree, transposeSplitTree } from './editSplitData';
import produce from "immer";

export default {
    title: "Splits",
    component: Splits
};

const demoData: SplitData = getSplitData('x', [{
    ratio: 0.8,
    content: getSplitData('y',  [{
        ratio: 0.7,
        content: getSplitData('x',  [{
            ratio: 0.4,
            content: <div>Left sidebar</div>
        }, {
            ratio: 0.6,
            content: <div>Main content</div>
        }])
    }, {
        ratio: 0.3,
        content: <div>Bottom panel</div>
    }])
}, {
    ratio: 0.2,
    content: <div>Right sidebar</div>
}]);
export const Static = () => {
    return <DndProvider backend={HTML5Backend}>
        <div style={{ height: '300px' }}>
            <Splits >
                {demoData}
            </Splits>
        </div>
    </DndProvider>;
}

export const Resizable = () => {
    const minSize = 30;
    const [data, drag] = React.useReducer((state: SplitData, move: [number[], number, number]) => {
        return resizeSplit(state, ...move);
    }, demoData);
    return <DndProvider backend={HTML5Backend}>
        <div style={{ height: '300px'}}>
            <SplitsLayer/>
            <Splits minSize={minSize} onResize={(node, after, amount) => drag([node, after, amount])}>
                {data}
            </Splits>
        </div>
    </DndProvider>;
}

const tabSplitDemo: SplitData<TabData[]> = getSplitData( 'x', [{
    ratio: 0.8,
    content: getSplitData('y', [{
        ratio: 0.7,
        content: getSplitData('x', [{
            ratio: 0.4,
            content: [
                { id: 7, title: 'Overview', children: <div>Project tree</div> },
                { id: 8, title: 'Utility', children: <div>Basically anything</div> },
                { id: 6, title: 'Object tree', children: <div>Trees work nice here</div> },
            ]
        }, {
            ratio: 0.6,
            content: [
                { id: 9, title: 'Main view', children: <div>A canvas with scattered items</div> },
                { id: 10, title: 'Code', children: <div>A code editor might also go here</div> },
                { id: 11, title: 'Preview', children: <div>You can put a whole separate page in here</div> },
            ]
        }])
    }, {
        ratio: 0.3,
        content: [
            { id: 2, title: 'Log', children: <div>A rolling action and event log</div> },
            { id: 3, title: 'Console', children: <div>A line-based control</div> },
            { id: 4, title: 'Tasks', children: <div>A list of few items with many properties</div> },
            { id: 5, title: 'Timeline', children: <div>Horizontal timelines can also go here</div> }
        ]
    }])
}, {
    ratio: 0.2,
    content: [
        { id: 0, title: 'Parameters', children: <div>Something contextual, like the selected item</div> },
        { id: 1, title: 'Settings', children: <div>General settings</div> }
    ]
}])

type TabDragEvent = {
    type: 'tabDrag',
    details: [number[], number, ID, number[]]
}
type ResizeEvent = {
    type: 'resize',
    details: [number[], number, number]
}
type SplitEvent = {
    type: 'split',
    details: [number[], Side, TabDrag<number[]>]
}
type Cell = TabData<number[]>[];

export const Splittable = () => {
    const minSize = 30;
    const [ref, dim] = useDimensions();
    const [data, event] = React.useReducer((state: SplitSubdata<Cell>, ev: ResizeEvent|SplitEvent|TabDragEvent) => {
        let temp = state;
        if (ev.type == 'tabDrag') {
            const [to, insert, id, [...from]] = ev.details;
            temp = produce(temp, draft => {
                const tabs = traverseSplitTree(draft, from) as Cell;
                const item = removeTab(tabs, id);
                const target = traverseSplitTree(draft, to) as Cell;
                target.splice(insert, 0, item);
            });
            temp = fixSplitTree(temp, cell => 0 < cell.length);
        } else if (ev.type == 'split') {
            const [target, side, drag] = ev.details;
            const { id, metadata } = drag;
            let item: TabData<number[]>;
            temp = editSplitData(temp, metadata, leaf => {
                const newLeaf = [...leaf as TabData<number[]>[]];
                item = removeTab(newLeaf, id);
                return newLeaf;
            });
            const after = side === 'left' || side === 'bottom';
            temp = subdivideSplit(temp, target, side, [item]);
            temp = fixSplitTree(temp, cell => 0 < cell.length);
        } else if (ev.type == 'resize') temp = resizeSplit(state as SplitData<Cell>, ...ev.details);
        return fixSplitSizes(temp, minSize, { x: dim.width, y: dim.height });
    }, tabSplitDemo);
    const resize: ResizeHandler = (...details) => event({ type: 'resize', details });
    const split: SplitHandler<TabDrag<number[]>, 'TAB'> = (path, side, item) => {
        event({ type: 'split', details: [path, side, item] });
    };
    return <DndProvider backend={HTML5Backend}>
        <div ref={upCastRef(ref)} style={{ height: '300px' }} >
            <SplitsLayer/>
            <Splits<'TAB', TabDrag<number[]>> minSize={minSize}
                splitTypes={['TAB']} onResize={resize}
                onSplit={split}>
                {transposeSplitTree(data, null, (path, tabs) => <>
                    <Tabs onMove={(...tab) => event({ type: 'tabDrag', details: [path, ...tab]})}>
                        {tabs.map((tab) => ({ ...tab, metadata: path }))}
                    </Tabs>
                </>)}
            </Splits>
        </div>
    </DndProvider>
}
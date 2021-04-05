import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Splits, { getSplitData } from "./Splits";
import { fixSplitSizes } from './fixSplitData';
import { SplitData, TabSplitsProps } from "./Splits.types";
import { upCastRef, useDimensions } from "../utils";
import SplitsLayer from './SplitsLayer';
import Tabs from '../Tabs';
import { TabData, TabDrag } from '../Tabs/Tabs.types';
import { resizeSplit, transposeSplitTree } from './editSplitData';
import { moveTab, splitWithTab, TabSplits } from './TabSplits';
import { ID, Side } from "../types";

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
    type: 'move',
    details: Parameters<TabSplitsProps['onMove']>
}
type ResizeEvent = {
    type: 'resize',
    details: Parameters<TabSplitsProps['onResize']>
}
type SplitEvent = {
    type: 'split',
    details: Parameters<TabSplitsProps['onSplit']>
}
type Cell = TabData<number[]>[];

export const Splittable = () => {
    const minSize = 30;
    const [ref, dim] = useDimensions();
    const [data, event] = React.useReducer((state: Cell | SplitData<Cell>, ev: ResizeEvent|SplitEvent|TabDragEvent) => {
        let temp = state;
        if (ev.type == 'move') temp = moveTab(temp, ...ev.details);
        else if (ev.type == 'split') temp = splitWithTab(temp, ...ev.details);
        else if (ev.type == 'resize') temp = resizeSplit(temp as SplitData<Cell>, ...ev.details);
        return fixSplitSizes(temp, minSize, { x: dim.width, y: dim.height });
    }, tabSplitDemo);
    return <DndProvider backend={HTML5Backend}>
        <div ref={upCastRef(ref)} style={{ height: '300px' }}>
            <TabSplits minSize={minSize}
                onResize={(...details) => event({ type: 'resize', details })}
                onSplit={(...details) => event({ type: 'split', details })}
                onMove={(...details) => event({ type: 'move', details })}>
                {data}
            </TabSplits>
        </div>
    </DndProvider>
}
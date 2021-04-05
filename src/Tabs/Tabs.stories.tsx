// Generated with util/create-component.js
import produce from "immer";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ID } from "../types";
import Tabs, { removeTab } from "./Tabs";
import { TabData } from "./Tabs.types";

export default {
    title: "Tabs",
    comopnent: Tabs,
};

export const BasicUsage = () => {
    const [children, move] = React.useReducer((current: TabData[], [id, index]: [ID, number]) => {
        const items = [...current];
        // Locate the moved tab
        const currentIdx = items.findIndex(el => el.id == id);
        // You could check for matching positions here if you want to save a render.
        // Remove the tab from its current position
        const [elem] = items.splice(currentIdx, 1);
        // Insert it at its new position
        items.splice(index, 0, elem);
        return items;
    }, [
        {id: 'foo', title: '0th tab', children: <div>My random content</div>},
        {id: 'bar', title: '1st tab', children: <div>Wamble doffer goo</div>},
        {id: 'baz', title: 'Last tab', children: <div>It doesn't matter what goes here</div>}
    ]);
    return <DndProvider backend={HTML5Backend}>
        <Tabs onMove={(to, id) => move([id, to])}>
            {children}
        </Tabs>
    </DndProvider>
};

export const ScrollableTabs = () => {
    const [children, move] = React.useReducer((current: TabData[], [id, index]: [ID, number]) => {
        const items = [...current];
        // Locate the moved tab
        const currentIdx = items.findIndex(el => el.id == id);
        // You could check for matching positions here if you want to save a render.
        // Remove the tab from its current position
        const [elem] = items.splice(currentIdx, 1);
        // Insert it at its new position
        items.splice(index, 0, elem);
        return items;
    }, [
        {id: 'foo', title: '0th tab', children: <div>My random content</div>},
        {id: 'bar', title: '1st tab', children: <div>Wamble doffer goo</div>},
        {id: 'baz', title: '2nd tab', children: <div>It doesn't matter what goes here</div>},
        {id: 'quz', title: '3rd tab', children: <div>Extra tab to show how much space we have</div>},
        {id: 'qux', title: '4th tab', children: <div>It could go on and on</div>},
        {id: 'wibble', title: 'Last tab', children: <div>You can scroll all you like</div>}
    ]);
    return <DndProvider backend={HTML5Backend}>
        <div style={{ width: '200px' }}>
            <Tabs onMove={(to, id) => move([id, to])}>
                {children}
            </Tabs>
        </div>
    </DndProvider>
};

interface Move {
    id: ID
    container: number
    index: number
    meta: number
}

export const MultipleContainers = () => {
    // Here we demonstrate how one might write a reducer for multiple comtainers.
    // The metadata field is used to find the container in which to look for the
    // tab
    const [items, move] = React.useReducer(
        (state: TabData<number>[][], { id, container, index, meta }: Move) => {
            return produce(state, draft => {
                let item = removeTab(draft[meta], id);
                item = {...item, metadata: container};
                draft[container].splice(index, 0, item);
            });
        }, [
            [
                {id: 0, title: 'tab #0', children: <div>First content</div>},
                {id: 1, title: 'tab #1', children: <div>I really wonder</div>},
                {id: 2, title: 'tab #2', children: <div>What could go in these</div>}
            ],
            [
                {id: 3, title: 'tab #3', children: <div>Maybe movie references</div>},
                {id: 4, title: 'tab #4', children: <div>Or some witty remarks regarding the library</div>},
                {id: 5, title: 'tab #5', children: <div>I guess this will suffice for now</div>},
            ]
        ],
        // Add the appropriate set numbers to every element in the initial state.
        data => data.map((set, idx) => set.map(el => ({...el, metadata: idx})))
    );
    return <DndProvider backend={HTML5Backend}>
        <Tabs onMove={(index, id, meta) => move({ index, id, meta, container: 0 })}>
            {items[0]}
        </Tabs>
        <Tabs onMove={(index, id, meta) => move({ index, id, meta, container: 1 })}>
            {items[1]}
        </Tabs>
    </DndProvider>
}
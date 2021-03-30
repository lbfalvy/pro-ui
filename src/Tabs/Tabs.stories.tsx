// Generated with util/create-component.js
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Tabs from "./Tabs";
import { ID, TabData } from "./Tabs.types";

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

interface Move {
    id: ID
    container: number
    index: number
    meta: number
}

export const MultipleContainers = () => {
    const [items, move] = React.useReducer(
        (current: TabData[][], { id, container, index, meta: set }: Move) => {
            const sets = [...current.map(set => [...set])];
            // Find the tab based on the set number stored in its metadata
            const currentIndex = sets[set].findIndex((el) => el.id == id);
            // Remove the tab from its current position
            let [item] = sets[set].splice(currentIndex, 1);
            // Update the metadata to represent the new container
            item = {...item, metadata: container};
            // Place it in the new container
            sets[container].splice(index, 0, item);
            return sets;
        },
        // Example tab set without metadata
        [
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
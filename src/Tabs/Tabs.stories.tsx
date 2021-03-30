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
        const currentIdx = items.findIndex(([i]) => i == id);
        const [elem] = items.splice(currentIdx, 1);
        items.splice(index, 0, elem);
        return items;
    }, [
        ['0', '0th tab', <div>My random bullshit</div>],
        ['1', '1st tab', <div>Wamble doffer goo</div>],
        ['2', 'Last tab', <div>It doesn't matter what goes here</div>]
    ]);
    return <DndProvider backend={HTML5Backend}>
        <Tabs onMove={(id, to) => move([id, to])}>
            {children}
        </Tabs>
    </DndProvider>
};

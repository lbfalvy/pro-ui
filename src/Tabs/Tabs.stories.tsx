// Generated with util/create-component.js
import React from "react";
import Tabs from "./Tabs";
import { TabData } from "./Tabs.types";

export default {
    title: "Tabs"
};

export const WithBar = () => {
    const [children, move] = React.useReducer((current: TabData[], [id, index]: [string, number]) => {
        const items = [...current];
        const currentIdx = items.findIndex(([i]) => i == id);
        const [elem] = items.splice(currentIdx, 1);
        items.splice(index, 0, elem);
        return items;
    }, [
        ['0', '0th tab', <div>My random bullshit</div>]
    ]);
    return <Tabs onMove={(id, to) => move([id, to])}>
        {children}
    </Tabs>
};

// Generated with util/create-component.js
import React from "react";

import { TabsProps } from "./Tabs.types";

import "./Tabs.scss";
import { useDrag, useDrop } from "react-dnd";
import { classList, mergeRefs } from "../utils";

const Tabs: React.FC<TabsProps> = ({ children, onMove }) => {
    const [active, setActive] = React.useState<string>();
    const [over, drop] = useDrop({
        accept: 'TAB',
        drop: ({ id }, monitor) => {
            if (monitor.didDrop()) return;
            onMove(id, children.length);
        },
        collect: monitor => monitor.isOver({ shallow: true })
    }, [children.length, onMove]);
    return <div data-testid="Tabs" className="foo-bar">
        <div ref={drop} className={over ? 'over' : ''}>
            {children.map(([id, title], idx, array) => <>
                <Tab key={id} id={id} active={id == active} onDrop={id => {
                    const draggedFromBefore = array.map(el => el[0]).slice(0, idx).includes(id);
                    onMove(id, draggedFromBefore ? idx - 1 : idx);
                }} onClick={() => setActive(id)}>
                    {title}
                </Tab>
            </>)}
        </div>
        <div>
            {children.map(([id, _, content]) => <div key={id} >
                {content}
            </div>)}
        </div>
    </div>
};

interface TabProps {
    id: string
    children: React.ReactNode
    active: boolean
    onDrop: (id: string) => void
    onClick: () => void
}
const Tab: React.FC<TabProps> = ({ id, children, active, onDrop, onClick }) => {
    const [over, drop] = useDrop({
        accept: 'TAB',
        drop: ({ id }, monitor) => {
            if (monitor.didDrop()) return;
            onDrop(id);
        },
        collect: monitor => monitor.isOver({ shallow: true })
    }, [onDrop]);
    const [, drag] = useDrag({
        type: 'TAB',
        item: { id }
    }, [id]);
    return <div ref={mergeRefs<HTMLDivElement>(drag, drop)} className={classList({
        'over': over,
        'active': active
    })} onClick={onClick}>
        {children}
    </div>;
}

export default Tabs;


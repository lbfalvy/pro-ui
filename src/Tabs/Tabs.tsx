// Generated with util/create-component.js
import React from "react";

import { ID, TabsProps } from "./Tabs.types";

import "./Tabs.scss";
import { useDrag, useDrop } from "react-dnd";
import { classList, mergeRefs } from "../utils";

const Tabs: React.FC<TabsProps> = ({ children, onMove, active: activeDefault }) => {
    const [active, setActive] = React.useState<ID>(activeDefault);
    if (!children.some(([id]) => id == active)) setActive(children[0][0]);
    const [over, drop] = useDrop({
        accept: 'TAB',
        drop: ({ id }, monitor) => {
            if (monitor.didDrop()) return;
            onMove?.(id, children.length);
        },
        collect: monitor => monitor.isOver({ shallow: true })
    }, [children.length, onMove]);
    return <div data-testid="Tabs" className="tabs-container">
        <div ref={drop} className={classList({
            'tabs-container-heads': true,
            'over': over
        })}>
            {children.map(([id, title], idx) => <>
                <Tab key={id} id={id} active={id == active}
                    onDrop={id => onMove?.(id, idx)} onClick={() => setActive(id)}
                >
                    {title}
                </Tab>
            </>)}
        </div>
        <div className={'tabs-container-bodies'}>
            {children.map(([id, _, content]) => <>
                <div key={id} className={id == active ? 'active' : ''}>
                    {content}
                </div>
            </>)}
        </div>
    </div>
};

interface TabProps {
    id: ID
    children: React.ReactNode
    active: boolean
    onDrop: (id: ID) => void
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
    const [dragged, drag] = useDrag({
        type: 'TAB',
        item: { id },
        collect: monitor => monitor.isDragging()
    }, [id]);
    return <div ref={mergeRefs<HTMLDivElement>(drag, drop)} className={classList({
        'over': over,
        'active': active,
        'dragged': dragged
    })} onClick={onClick}>
        {children}
    </div>;
}

export default Tabs;


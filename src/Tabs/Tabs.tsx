// Generated with util/create-component.js
import React from "react";

import { ID, TabsProps } from "./Tabs.types";

import "./Tabs.scss";
import { useDrag, useDrop } from "react-dnd";
import { classList, mergeRefs } from "../utils";

const Tabs: React.FC<TabsProps> = ({ children, onMove, active: activeDefault }) => {
    const [active, setActive] = React.useState<ID>(activeDefault);
    if (!children.some(({id}) => id == active) && children.length) setActive(children[0].id);
    const [over, drop] = useDrop({
        accept: 'TAB',
        drop: ({ id, metadata }, monitor) => {
            if (monitor.didDrop()) return;
            onMove?.(children.length, id, metadata);
        },
        collect: monitor => monitor.isOver({ shallow: true })
    }, [children.length, onMove]);
    return <div data-testid="Tabs" className="tabs-container">
        <div ref={drop} className={classList({
            'tabs-container-heads': true,
            'over': over
        })}>
            <div key="height-holder" className="height-holder">If you see this text, CSS is broken.</div>
            {children.map(({id, title, metadata}, idx) => <>
                <Tab key={id} id={id} metadata={metadata} active={id == active}
                    onDrop={(id, meta) => onMove?.(idx, id, meta)} onClick={() => setActive(id)}
                >
                    {title}
                </Tab>
            </>)}
        </div>
        <div className={'tabs-container-bodies'}>
            {children.map(({id, children: content}) => <>
                <div key={id} className={id == active ? 'active' : ''}>
                    {content}
                </div>
            </>)}
        </div>
    </div>
};

interface TabProps {
    id: ID
    metadata: any
    children: React.ReactNode
    active: boolean
    onDrop: (id: ID, metadata: any) => void
    onClick: () => void
}
const Tab: React.FC<TabProps> = ({ id, metadata, children, active, onDrop, onClick }) => {
    const [over, drop] = useDrop({
        accept: 'TAB',
        drop: ({ id, metadata }, monitor) => {
            if (monitor.didDrop()) return;
            onDrop(id, metadata);
        },
        collect: monitor => monitor.isOver({ shallow: true })
    }, [onDrop]);
    const [dragged, drag] = useDrag({
        type: 'TAB',
        item: { id, metadata },
        collect: monitor => monitor.isDragging()
    }, [id]);
    return <div ref={mergeRefs<HTMLDivElement>(drag, drop)} className={classList({
        'tabs-container-head': true,
        'over': over,
        'active': active,
        'dragged': dragged
    })} onClick={onClick}>
        {children}
    </div>;
}

export default Tabs;


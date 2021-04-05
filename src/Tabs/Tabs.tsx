// Generated with util/create-component.js
import React from "react";

import { TabsProps, TabDrag, TabData } from "./Tabs.types";

import "./Tabs.scss";
import { useDrag, useDrop } from "react-dnd";
import { classList, mergeRefs } from "../utils";
import { ID } from "../types";

/**
 * Tabbed view component with the ability to reorder tabs by drag and drop and
 * to move them across containers. Use {@link removeTab} in an appropriate
 * event handler to achieve this functionality.
 * @category Tabs
 * @template T type of the metadata field
 * @param param0
 * @returns 
 */
function Tabs<T>({ children, onMove, active: activeDefault, onSelect }: TabsProps<T>): React.ReactElement {
    const [active, setActive] = React.useState<ID | undefined>(activeDefault);
    if (!children.some(({id}) => id == active) && children.length) setActive(children[0].id);
    const [over, drop] = useDrop<TabDrag<T>, void, boolean>({
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
        })} onWheel={ev => {
            ev.preventDefault();
            ev.currentTarget.scrollBy({ behavior: 'auto', left: ev.deltaY * 10 });
        }}>
            <div key="height-holder" className="height-holder">
                If you see this text, CSS is broken.
            </div>
            {children.map(({id, title, metadata}, idx) => <>
                <Tab<T> key={id} id={id} metadata={metadata!} active={id == active}
                    onDrop={(id, meta) => onMove?.(idx, id, meta)} onClick={() => {
                        onSelect?.(id);
                        setActive(id);
                    }}>
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

interface TabProps<T> {
    id: ID
    metadata: T
    children: React.ReactNode
    active: boolean
    onDrop: (id: ID, metadata: T) => void
    onClick: () => void
}

function Tab<T>({ id, metadata, children, active, onDrop, onClick }: TabProps<T>): React.ReactElement {
    const [over, drop] = useDrop<TabDrag<T>, void, boolean>({
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
    return <div ref={mergeRefs(drag, drop)} className={classList({
        'tabs-container-head': true,
        'over': over,
        'active': active,
        'dragged': dragged
    })} onClick={onClick}>
        {children}
    </div>;
}

export default Tabs;

/**
 * Removes and returns the tab with the given ID from the collection. Use this
 * to retrieve the dragged tab and insert it in the new location with a simple
 * `data.splice(0, tab)` to execute a tab drag action.
 * @category Tabs
 * @param tabs Tabs state
 * @param id Tab to be removed
 * @returns The removed tab
 */
export function removeTab<T>(tabs: TabData<T>[], id: ID): TabData<T> | undefined {
    return tabs.splice(tabs.findIndex(el => el.id === id), 1)[0]
}
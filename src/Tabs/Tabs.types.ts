import React from "react";
import Tabs from "./Tabs";

export type ID = string|number;

// Generated with util/create-component.js
export type TabData = {
    id: ID
    title: React.ReactNode
    children: React.ReactNode
    metadata?: any
};
export interface TabsProps {
    children: TabData[]
    onMove?: (toPosition: number, id: ID, metadata: any) => void
    active?: ID
}

/**
 * Component is generated with ID-d, named children with contents.
 * When copying, it sends only the ID.
 * When dropped on, it tells which ID should be moved, and to what position.
 *      Notice that in the case of a self-drop, the position is already adjusted for the removal of the element.
 * The concept is that if the parent recognizes this ID it executes the move, if it doesn't then it gets passed
 * upwards.
 * This may or may not become a Context in the future.
 */
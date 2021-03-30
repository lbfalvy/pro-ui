import React from "react";
import Tabs from "./Tabs";

// Generated with util/create-component.js
export type TabData = [string, React.ReactNode, React.ReactNode];
export interface TabsProps {
    children: TabData[]
    onMove: (id: string, toPosition: number) => void
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
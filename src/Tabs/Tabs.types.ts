import React from "react";
import { ID } from "../types";

/**
 * A single tab in a {@link Tabs} container. id should be unique to any set of
 * tabs present at the same time because the user may drag them around.
 * @category Tabs
 */
export interface TabData<T = undefined> {
    id: ID
    title: React.ReactNode
    children: React.ReactNode
    metadata?: T
};

/**
 * Props to the {@link Tabs} component
 * @category Tabs
 * @template T type of metadata, if present.
 */
export interface TabsProps<T = undefined> {

    /**
     * The specification from which the tabs are built.
     */
    children: TabData<T>[]

    /**
     * Called when a tab is dropped on this container. use {@link removeTab} to
     * extract it from its current position and splice it into this container's
     * {@link children}.
     * @param toPosition Tells you where to insert the tab
     * @param id Refers to the dragged tab
     * @param metadata Refers to the dragged tab
     */
    onMove?: (toPosition: number, id: ID, metadata: T) => void

    /**
     * If specified and this id is present in {@link children} then it will be
     * selected. In all other cases, the first tab will be selected by default.
     */
    active?: ID

    /**
     * Called when a different tab is selected. Use this to update
     * {@link active} if you set it explicitly.
     */
    onSelect?: (id: ID) => void
}

export interface TabDrag<T> {
    id: ID
    metadata: T
}
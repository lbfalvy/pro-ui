import React from "react";

export type ID = string|number;

export type TabData<T = undefined> = {
    id: ID
    title: React.ReactNode
    children: React.ReactNode
    metadata?: T
};

export interface TabsProps<T = undefined> {
    children: TabData<T>[]
    onMove?: (toPosition: number, id: ID, metadata: T) => void
    active?: ID
}

export interface TabDrag<T> {
    id: ID
    metadata: T
}
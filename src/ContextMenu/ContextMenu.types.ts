import React from "react";

/**
 * The first element is the title, the second is the action.  
 * If the action is a function, it is executed.  
 * If it is an array, it is rendered as a submenu.  
 * If it is falsy, it is treated as a disabled menu item.
 */
export type ContextMenuOption = [React.ReactNode, (() => void) | ContextMenuOption[] | undefined | null | false]

/**
 * Props to the {@link ContextMenu} component
 */
export interface ContextMenuProps extends React.HTMLProps<HTMLDivElement> {
    options: ContextMenuOption[],
    children: React.ReactNode
}

/**
 * Type of {@link MenuCtx}.
 */
export interface MenuContext {
    setTimeout: (timeout: number) => void,
    options: ContextMenuOption[],
    display: (options: ContextMenuOption[], x: number, y: number) => void,
}

/**
 * Props to the {@link DropdownMenu} component
 */
export interface DropdownMenuProps {
    options: ContextMenuOption[]
    top: number
    bottom?: number
    left: number
    right?: number
}

export interface TItleProps {
    children: React.ReactNode
}

export interface PropsNoValue {
    title: React.ReactNode
}

export interface SubmenuProps extends PropsNoValue {
    options: ContextMenuOption[],
    id: number
    open: number,
    onOpen: (id: number) => void
}

export interface ActionProps extends PropsNoValue {
    action: () => void
}
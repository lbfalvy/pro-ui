import React from "react";

/**
 * The first element is the title, the second is the action.  
 * If the action is a function, it is executed.  
 * If it is an array, it is rendered as a submenu.  
 * If it is falsy, it is treated as a disabled menu item.
 * @category ContextMenu
 */
export type ContextMenuOption = [React.ReactNode, (() => void) | ContextMenuOption[] | undefined | null | false]

/**
 * Props to the {@link ContextMenu} component
 * @category ContextMenu
 */
export interface ContextMenuProps extends React.HTMLProps<HTMLDivElement> {
    options: ContextMenuOption[],
    children: React.ReactNode
}

/**
 * Type of {@link MenuCtx}.
 * @category ContextMenu
 */
export interface MenuContext {
    /**
     * Time in miliseconds that submenus remain open after the mouse is no
     * longer over them.
     */
    setTimeout: (timeout: number) => void,

    /**
     * List of context menu defined until now
     */
    options: ContextMenuOption[],

    /**
     * Render a context menu
     */
    display: (options: ContextMenuOption[], x: number, y: number) => void,
}

/**
 * Props to the {@link DropdownMenu} component. The menu will render to a
 * corner of the provided rectangle. If you want it to render to the sides or
 * above/below, invert the box along either axis.
 * @category ContextMenu
 */
export interface DropdownMenuProps {
    options: ContextMenuOption[]

    /**
     * The menu will try to align its bottom with this line
     */
    top: number

    /**
     * The menu will try to align its top with this line
     */
    bottom?: number

    /**
     * The menu will try to align its right side with this line
     */
    left: number

    /**
     * The menu will try to align its left side with this line
     */
    right?: number

    /**
     * Menu trees use this internally.
     * @private
     */
    active?: [number[], (v: number[]) => void]
}

export interface TItleProps {
    children: React.ReactNode
}

export interface PropsNoValue {
    title: React.ReactNode
    active: boolean
    setActive: () => void
}

export interface SubmenuProps extends PropsNoValue {
    options: ContextMenuOption[],
    id: number
    sub: number[]
    setSub: (v: number[]) => void
}

export interface ActionProps extends PropsNoValue {
    action: () => void
}
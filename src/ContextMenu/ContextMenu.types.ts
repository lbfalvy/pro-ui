import React from "react";

export type Option = [React.ReactNode, (() => void) | Option[] | undefined | null | false]

export interface ContextMenuProps extends React.HTMLProps<HTMLDivElement> {
    options: Option[],
    children: React.ReactNode
}

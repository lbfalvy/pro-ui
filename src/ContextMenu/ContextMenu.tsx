// Generated with util/create-component.js
import React from "react";

import { ContextMenuProps, ContextMenuOption, DropdownMenuProps, TItleProps, SubmenuProps, PropsNoValue, ActionProps, MenuContext } from "./ContextMenu.types";

import "./ContextMenu.scss";
import ReactDOM from "react-dom";
import { classList, mergeRefs, useWindowDimensions } from "../utils";
import { useDimensions } from "../useDimensions";

/**
 * A context menu component. Use it like a context provider, pass the context
 * menu entries in `options`. It will add them to the menu, but it will also
 * show all options from enclosing ContextMenu instances. Also note that this
 * inserts a new div into the DOM, any props other than `options` and
 * `children` are passed directly to that div.
 * 
 * The menu is rendered with {@link DropdownMenu} but you can also call it
 * directly.
 * @category ContextMenu
 * @param param0 
 * @returns 
 */
function ContextMenu({ options, children, ...rest }: ContextMenuProps): React.ReactElement {
    const prev = React.useContext(MenuCtx);
    const allOptions = React.useMemo(() => (prev.options.length ? [
        ...options,
        [<hr />, null],
        ...prev.options
    ] : options) as ContextMenuOption[], [options, prev.options]);
    return <MenuCtx.Provider value={{ ...prev, options: allOptions }}>
        <div {...rest} onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
            prev.display(allOptions, e.clientX, e.clientY);
        }}>
            {children}
        </div>
    </MenuCtx.Provider>
}

/**
 * The context menu context. You can use it directly to set the submenu
 * timeout, create a menu provider that doesn't inherit the parent's
 * options, or provide an alternative means of displaying the menu.
 * @category ContextMenu
 */
export const MenuCtx = React.createContext<MenuContext>({
    setTimeout: t => { timeout = t },
    options: [],
    display: (options, x, y) => {
        const div = getOrCreateDiv(menuId);
        div.oncontextmenu = e => e.preventDefault();
        ReactDOM.render(<DropdownMenu options={options} left={x} top={y} key={`${x};${y}`} />, div);
        window.addEventListener('click', () => div.remove(), { once: true });
    }
});
let timeout = 3000;

const menuId = 'contextMenuHost';
function getOrCreateDiv(id: string): HTMLDivElement {
    let div = document.getElementById(id);
    if (!div) {
        div = document.createElement('div');
        div.id = id;
        document.body.append(div);
    } else if (div.tagName !== 'DIV') {
        throw new Error(`Element already exists and is not div but ${div.tagName}`);
    }
    return div as HTMLDivElement;
}

/**
 * Renders a multilevel menu to any corner of the given box. You can use it
 * directly to create a menubar for example.
 * 
 * It is used to render {@link ContextMenu}.
 * @category ContextMenu
 * @param param0 
 * @returns 
 */
export function DropdownMenu({
    options, top, bottom, left, right, active: parentActive
}: DropdownMenuProps): React.ReactElement {
    bottom ??= top;
    right ??= left;
    // The topmost element will remember the active state
    const fallbackActive = React.useState<number[]>([])
    if (parentActive && fallbackActive[0].length != 0) fallbackActive[1]([])
    const [active, setActive] = parentActive ?? fallbackActive
    // Calculate position
    const [ref, dims] = useDimensions<HTMLDivElement>();
    const [width, height] = useWindowDimensions();
    const fitsBelow = bottom + dims.height < height;
    const fitsRight = right + dims.width < width;
    const fitsLeft = 0 < left - dims.width;
    const fitsAbove = 0 < top - dims.height;
    // Current active element, state of active submenu
    const [choice, ...subchoice] = active;
    const setChoice = React.useCallback(
        (c: number) => setActive([c]), // flushes subchoice
        [setActive]
    )
    const setSubchoice = React.useCallback(
        (sc: number[]) => setActive([choice, ...sc]), // Preserves choice
        [setActive, choice]
    )
    return <div ref={ref} className='dropdown-menu' style={Object.assign(
        fitsBelow ? { top: `${bottom}px` }
        : fitsAbove ? { bottom: `${height - top}px` }
        : { bottom: 0 },
        fitsRight ? { left: `${right}px` }
        : fitsLeft ? { right: `${width - left}px` }
        : { right: 0 }
    )}>
        {options.map(([title, value], i) => {
            const active = choice == i;
            const setActive = () => setChoice(i)
            return typeof value == 'function'
                ? <Action title={title} action={value} active={active} setActive={setActive} />
                : value instanceof Array
                ? <Submenu title={title} options={value} id={i} active={active}
                    setActive={setActive} sub={subchoice} setSub={setSubchoice} />
                : value === null || value === undefined || value === false
                ? <Disabled title={title} active={active} setActive={setActive} />
                : <Unrecognized title={title} active={active} setActive={setActive} />
        })}
    </div>
}
function Action({ title, action, active, setActive }: ActionProps): React.ReactElement {
    return <div className={classList('context-entry', active && 'active')}
        onMouseEnter={setActive} onClick={ev => action()}>
        <Title>{title}</Title>
    </div>
}

function Disabled({ title }: PropsNoValue): React.ReactElement {
    return <div className='context-disabled'><Title>{title}</Title></div>
}
function Unrecognized({ title }: PropsNoValue): React.ReactElement {
    return <div className='context-unrecognized'><Title>{title}</Title></div>
}

function Submenu({ title, options, id, active, setActive, sub, setSub }: SubmenuProps): React.ReactElement {
    const [dimref, dims, visible] = useDimensions();
    const el = React.useRef<HTMLDivElement>(null);
    return <div ref={mergeRefs(el, dimref)} /*onClick={e => e.stopPropagation()}*/
        className={classList('context-submenu context-entry', active && 'active')} onMouseEnter={e => {
            e.stopPropagation()
            setActive()
        }}>
        <Title>{title}</Title>
        {active && visible ? <ExtractToBody>
            <DropdownMenu options={options} {...dims} top={dims.bottom} bottom={dims.top-1}
                active={[sub, setSub]} />
        </ExtractToBody> : null}
    </div>
}

function Title({ children }: TItleProps): React.ReactElement {
    const el = React.useRef<HTMLElement>(null);
    React.useLayoutEffect(() => {
        if (!el.current) return;
        if (el.current.scrollWidth > el.current.clientWidth)
            el.current.setAttribute('title', children?.toString() ?? '');
        else el.current.removeAttribute('title');
    })
    return <span className='context-title' ref={el}>{children}</span>
}

function ExtractToBody({ children }: { children: React.ReactNode }): React.ReactElement | null {
    const [node, setNode] = React.useState<HTMLDivElement>();
    React.useEffect(() => {
        if (!node) {
            const div = document.createElement('div');
            setNode(div);
            document.body.append(div);
        }
        return () => {
            node?.remove();
            setNode(undefined);
        }
    }, []);
    if (node) return ReactDOM.createPortal(children, node);
    else return null;
}

export default ContextMenu;
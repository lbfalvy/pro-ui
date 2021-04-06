// Generated with util/create-component.js
import React from "react";

import { ContextMenuProps, Option } from "./ContextMenu.types";

import "./ContextMenu.scss";
import ReactDOM from "react-dom";
import { mergeRefs, useWindowDimensions } from "../utils";
import { useDimensions } from "../useDimensions";

function ContextMenu({ options, children, ...rest }: ContextMenuProps): React.ReactElement {
    const prev = React.useContext(MenuCtx);
    const allOptions = React.useMemo(() => (prev.options.length ? [
        ...options,
        [<hr />, null],
        ...prev.options
    ] : options) as Option[], [options, prev.options]);
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

const MenuCtx = React.createContext<{
    setTimeout: (timeout: number) => void,
    options: Option[],
    display: (options: Option[], x: number, y: number) => void,
}>({
    setTimeout: t => { timeout = t },
    options: [],
    display: (options, x, y) => {
        const div = getOrCreateDiv(menuId);
        div.oncontextmenu = e => e.preventDefault();
        ReactDOM.render(<DropdownMenu options={options} left={x} top={y} />, div);
        window.addEventListener('click', () => div.remove());
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

interface DropdownMenuProps {
    options: Option[]
    top: number
    bottom?: number
    left: number
    right?: number
}
function DropdownMenu({ options, top, bottom, left, right }: DropdownMenuProps): React.ReactElement {
    bottom ??= top;
    right ??= left;
    const [ref, dims] = useDimensions<HTMLDivElement>();
    const [width, height] = useWindowDimensions();
    const fitsBelow = bottom + dims.height < height;
    const fitsRight = right + dims.width < width;
    const fitsLeft = 0 < left - dims.width;
    const fitsAbove = 0 < top - dims.height;
    return <div ref={ref} className='dropdown-menu' style={Object.assign(
        fitsBelow ? { top: `${bottom}px` }
        : fitsAbove ? { bottom: `${height - top}px` }
        : { bottom: 0 },
        fitsRight ? { left: `${right}px` }
        : fitsLeft ? { right: `${width - left}px` }
        : { right: 0 }
    )}>
        {options.map(([title, value]) => (
            typeof value == 'function'
            ? <Action title={title} action={value} />
            : value instanceof Array
            ? <Submenu title={title} options={value} />
            : value === null || value === undefined || value === false
            ? <Disabled title={title} />
            : <Unrecognized title={title} />
        ))}
    </div>
}

interface ActionProps {
    title: React.ReactNode
    action: () => void
}
function Action({ title, action }: ActionProps): React.ReactElement {
    return <div onClick={ev => { 
        ev.stopPropagation();
        action();
    }}>
        <Title>{title}</Title>
    </div>
}

interface PropsNoValue { title: React.ReactNode }

function Disabled({ title }: PropsNoValue): React.ReactElement {
    return <div className='context-disabled'><Title>{title}</Title></div>
}
function Unrecognized({ title }: PropsNoValue): React.ReactElement {
    return <div className='context-unrecognized'><Title>{title}</Title></div>
}

interface SubmenuProps {
    title: React.ReactNode
    options: Option[]
}
function Submenu({ title, options }: SubmenuProps): React.ReactElement {
    const [state, event] = React.useReducer((
        state: 'closed'|'open'|'pending',
        event: 'click'|'enter'|'leave'|'timeout'
    ) => { switch (state) {
        case 'open': switch (event) {
            case 'click': return 'closed';
            case 'leave': return 'pending';
            case 'timeout': return 'closed';
            default: return state;
        }
        case 'closed': switch (event) {
            case 'click': return 'open';
            case 'enter': return 'open';
            default: return state;
        }
        case 'pending': switch (event) {
            case 'click': return 'closed';
            case 'enter': return 'open';
            case 'timeout': return 'closed';
            default: return state;
        }
        default: return state;
    } }, 'closed');
    const [dimref, dims] = useDimensions(true);
    const el = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (state == 'closed') return;
        const onClick = (ev: MouseEvent) => {
            const clicked = ev.target as HTMLElement;
            if (!el.current?.contains(clicked)) event('click');
        };
        window.addEventListener('click', onClick);
        return () => window.removeEventListener('click', onClick);
    });
    React.useEffect(() => {
        if (state != 'pending') return;
        const handle = setTimeout(() => event('timeout'), timeout);
        return () => clearTimeout(handle);
    }, [state]);
    return <div ref={mergeRefs(el, dimref)} className='context-submenu' onMouseEnter={() => event('enter')}
        onMouseLeave={() => event('leave')} onClick={() => event('click')}>
        <Title>{title}</Title>
        {state != 'closed' ? <>
            <DropdownMenu options={options} {...dims} top={dims.bottom} bottom={dims.top-1} />
        </> : null}
    </div>
}

interface TItleProps {
    children: React.ReactNode
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

export default ContextMenu;


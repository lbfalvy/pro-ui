// Generated with util/create-component.js
import React, { ReactNode } from "react";

import { Axis, ResizeHandler, ResizeItem, Side, SplitChild, SplitData, SplitHandler, SplitsProps } from "./Splits.types";

import "./Splits.scss";
import { classList, mergeRefs, useDimensions, usePointer } from "../utils";
import { useDrag, useDrop } from "react-dnd";

function Splits<K extends string, I = {}>({
    children,
    minSize, onResize, // Resizing
    splitTypes, onSplit // splitting
}: SplitsProps<K, I>) {
    const _minSize = minSize ?? 0;
    const splitTypesArray = typeof splitTypes == 'string' ? [splitTypes] : splitTypes ?? [];
    const [shouldShowSplit, drop] = useDrop({
        accept: splitTypesArray,
        collect: monitor => {
            const type = monitor.getItemType();
            return monitor.isOver()
                && typeof type == 'string'
                && ( splitTypes == type
                    || (splitTypes as string[] )?.includes(type) )
        }
    }, [splitTypes]);
    return <div ref={drop} className='splits-container'>
        {isSplitData(children)
            ? <SplitsContainer {...children} splitTypes={splitTypesArray} 
                onResize={onResize} onSplit={onSplit} minSize={_minSize} />
            : <div>{children}</div>}
        {shouldShowSplit ? <SplitOverlay<I, K> onSplit={onSplit} splitTypes={splitTypesArray} /> : null}
    </div>
}

interface SplitsContainerProps<K extends string, I> extends SplitData {
    minSize: number
    onResize?: ResizeHandler
    onSplit?: SplitHandler<I, K>
    splitTypes: K[]
}
function SplitsContainer<K extends string, I>({
    axis, children, minSize, onResize, onSplit, splitTypes
}: SplitsContainerProps<K, I>): React.ReactElement {
    const [ref, dimensions] = useDimensions<HTMLDivElement>();
    const size = axis == 'y' ? dimensions.height : dimensions.width;
    return <div ref={ref} className={`splits-subsplit splits-${axis}`}>
        {children.map(({ ratio, content }, i) => {
            // Child (handlers are passed up)
            const onChildResize: ResizeHandler | undefined = 
                onResize ? (r, ...p) => onResize([i, ...r], ...p) : undefined;
            const onChildSplit: SplitHandler<I, K> | undefined =
                onSplit ? (r, ...p) => onSplit([i, ...r], ...p) : undefined;
            const flexBasis = `${Math.round(ratio * 100)}%`;
            // Resize
            const isLast = i + 1 == children.length;
            const getOnSelfResize = () => {
                if (!onResize) return;
                const maxNegativeSizeChangePx = minSize - ratio * size;
                const maxPositiveSizeChangePx = children[i+1].ratio * size - minSize;
                return (amount: number) => {
                    const boundedSizeChangePx = Math.max(
                        maxNegativeSizeChangePx, 
                        Math.min(amount, maxPositiveSizeChangePx)
                    );
                    const boundedRatioChange = boundedSizeChangePx / size;
                    onResize([], i, boundedRatioChange);
                };
            }
            return <>
                <div className="splits-content" style={{ flexBasis }}>
                    <Splits minSize={minSize} splitTypes={splitTypes}
                        onResize={onChildResize} onSplit={onChildSplit}>
                        {content}
                    </Splits>
                </div>
                {isLast ? null : <ResizeHandle axis={axis} onResize={getOnSelfResize()} />}
            </>;
        })}
    </div>
}

interface HandleProps {
    axis: Axis
    onResize?: (amount: number) => void
}

const ResizeHandle: React.FC<HandleProps> = ({ axis, onResize }) => {
    const [measured, dimensions] = useDimensions<HTMLDivElement>();
    const getPointer = usePointer();
    const [dragged, drag] = useDrag<ResizeItem, void, boolean>({
        type: 'SPLIT_RESIZE',
        canDrag: onResize !== undefined,
        item: () => ({
            width: dimensions.width,
            height: dimensions.height,
            start: {...getPointer()},
            axis
        }),
        // We don't need to check didDrop because the boundaries are enforced
        end: ({ start, position }) => {
            if (!position) console.error('Missing DragLayer');
            else onResize?.(position[axis] - start[axis]);
        },
        collect: monitor => monitor.isDragging()
    });
    // It's just a div otherwise.
    return <div
        ref={mergeRefs(measured, drag)}
        className={classList({
            [`splits-border splits-border-${axis}`]: true,
            'enabled': onResize !== undefined,
            'dragged': dragged
        })}
    />
}

interface SplitOverlayProps<I, K extends string> {
    splitTypes: K[]
    baseIndex?: number
    onSplit?: SplitHandler<I, K>
}
function SplitOverlay<I, K extends string>({
    splitTypes, baseIndex, onSplit
}: SplitOverlayProps<I, K>): React.ReactElement {
    return <div className='splits-overlay'>{sides.map(side => <>
        <SplitArea<I, K> side={side} splitTypes={splitTypes}
            onSplit={(item, type) => onSplit?.(baseIndex ? [baseIndex] : [], side, item, type)} />
    </>)}</div>
}
interface SplitAreaProps<I, K extends string> {
    side: Side,
    splitTypes: K[],
    onSplit?: (item: I, type: K) => void
}
function SplitArea<I, K extends string>({ side, splitTypes, onSplit }: SplitAreaProps<I, K>): React.ReactElement {
    const [over, drop] = useDrop<I, void, boolean>({
        accept: [...splitTypes],
        drop: (item, monitor) => onSplit?.(item, monitor.getItemType() as K),
        collect: monitor => {
            const type = monitor.getItemType();
            return monitor.isOver() && typeof type == 'string'
                && (splitTypes as string[]).includes(type);
        }
    });
    return <div ref={drop} className={classList({
        [`splits-overlay-${side}`]: true,
        'over': over
    })} />
}

const sides: Side[] = ['top','bottom','left','right'];

export function getSplitData<T>(axis: Axis, children: SplitChild<T>[]): SplitData<T> {
    return { TYPE_ID: "SplitData", axis, children };
}
export function isSplitData<T = ReactNode>(def: SplitData<T> | T): def is SplitData<T> {
    const sd = def as SplitData<T>;
    return sd.TYPE_ID == 'SplitData';
}

export default Splits;

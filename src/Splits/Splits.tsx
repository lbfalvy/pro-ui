// Generated with util/create-component.js
import React, { ReactNode, useEffect } from "react";

import { ResizeItem, SplitChild, SplitData, SplitsProps } from "./Splits.types";

import "./Splits.scss";
import { classList, mergeRefs, upCastRef, usePointer } from "../utils";
import { useDrag, useDrop } from "react-dnd";
import { Axis, Side } from "../types";
import { useDimensions } from "../useDimensions";
import { getEmptyImage } from 'react-dnd-html5-backend';

/**
 * A drag and drop split container inspired by Visual Studio and the Unity
 * Editor. It supports resizing by dragging if {@link onResize} is defined and
 * a {@link SplitsLayer} component covers the whole container, and supports
 * reorganising by drag and drop if {@link onSplit} and {@link splitTypes} are
 * set.
 * 
 * If you want to use it with {@link Tabs}, check out {@link TabSplits}.
 * 
 * @category Splits
 * @param param0 
 * @returns 
 */
function Splits<T>({
    children,
    minSize, onResize, // Resizing
    splitTypes, onSplit // splitting
}: SplitsProps<T>) {
    const _minSize = minSize ?? 0;
    const splitTypesArray = typeof splitTypes == 'string' ? [splitTypes] : splitTypes ?? [];
    const [shouldShowSplit, drop] = useDrop({
        accept: splitTypesArray,
        canDrop: () => false,
        collect: monitor => {
            const type = monitor.getItemType();
            return monitor.isOver()
                && typeof type == 'string'
                && ( splitTypes == type
                    || (splitTypes as string[] )?.includes(type) )
        }
    }, [splitTypes]);
    const [shouldHighlightFrame, accept] = useDrop({
        accept: splitTypesArray,
        collect: monitor => {
            const type = monitor.getItemType();
            return monitor.isOver()/*
                && typeof type == 'string'
                && ( splitTypes == type
                    || (splitTypes as string[] )?.includes(type) )*/
        }
    })
    return <div ref={drop} className={classList('splits-container', shouldHighlightFrame && 'splits-highlight')}>
        {isSplitData(children)
            ? <SplitsContainer {...children} splitTypes={splitTypesArray} 
                onResize={onResize} onSplit={onSplit} minSize={_minSize} />
            : <div>{children}</div>}
        {shouldShowSplit ? <SplitOverlay<T> onSplit={onSplit} overFeedback={accept} splitTypes={splitTypesArray} /> : null}
    </div>
}

interface SplitsContainerProps<T> extends SplitData {
    minSize: number
    onResize?: (path: number[], after: number, amount: number) => void;
    onSplit?: (path: number[], side: Side, item: T, type: string) => void;
    splitTypes: string[]
}
function SplitsContainer<T>({
    axis, children, minSize, onResize, onSplit, splitTypes
}: SplitsContainerProps<T>): React.ReactElement {
    const [ref, dimensions] = useDimensions<HTMLDivElement>();
    const size = axis == 'y' ? dimensions.height : dimensions.width;
    return <div ref={ref} className={`splits-subsplit splits-${axis}`}>
        {children.map(({ ratio, content }, i) => {
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
                        onResize={upLink(i, onResize)} onSplit={upLink(i, onSplit)}>
                        {content}
                    </Splits>
                </div>
                {isLast ? null : <ResizeHandle axis={axis} onResize={getOnSelfResize()} />}
            </>;
        })}
    </div>
}

function upLink<Args extends any[], R>(n: number, f?: (p: number[], ...args: Args) => R): (typeof f | undefined) {
    return f ? (r, ...p) => f([n, ...r], ...p) : undefined;
}

interface HandleProps {
    axis: Axis
    onResize?: (amount: number) => void
}

const ResizeHandle: React.FC<HandleProps> = ({ axis, onResize }) => {
    const [measured, dimensions] = useDimensions<HTMLDivElement>();
    const pointer = usePointer();
    const [dragged, drag, preview] = useDrag<ResizeItem, void, boolean>({
        type: 'SPLIT_RESIZE',
        canDrag: onResize !== undefined,
        item: () => ({
            width: dimensions.width,
            height: dimensions.height,
            start: {...pointer},
            axis
        }),
        // We don't need to check didDrop because the boundaries are enforced
        end: ({ start, position }) => {
            if (!position) console.error('Missing DragLayer');
            else onResize?.(position[axis] - start[axis]);
        },
        collect: monitor => monitor.isDragging()
    });
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, []);
    // It's just a div otherwise.
    return <div
        ref={mergeRefs(measured, drag)}
        className={classList(
            `splits-border splits-border-${axis}`,
            onResize && 'enabled',
            dragged && 'dragged'
        )}
    />
}

interface SplitOverlayProps<T> {
    splitTypes: string[]
    baseIndex?: number
    overFeedback: React.Ref<HTMLElement>
    onSplit?: (path: number[], side: Side, item: T, type: string) => void;
}
function SplitOverlay<T>({
    splitTypes, baseIndex, onSplit, overFeedback: ref
}: SplitOverlayProps<T>): React.ReactElement {
    return <div ref={upCastRef(ref)} className='splits-overlay'>{sides.map(side => <>
        <SplitArea<T> side={side} splitTypes={splitTypes}
            onSplit={(item, type) => onSplit?.(baseIndex ? [baseIndex] : [], side, item, type)} />
    </>)}</div>
}
interface SplitAreaProps<T> {
    side: Side,
    splitTypes: string[],
    onSplit?: (item: T, type: string) => void
}
function SplitArea<T>({ side, splitTypes, onSplit }: SplitAreaProps<T>): React.ReactElement {
    const [over, drop] = useDrop<T, void, boolean>({
        accept: [...splitTypes],
        drop: (item, monitor) => onSplit?.(item, monitor.getItemType() as string),
        collect: monitor => {
            const type = monitor.getItemType();
            return monitor.isOver() && typeof type == 'string'
                && (splitTypes as string[]).includes(type);
        }
    });
    return <div ref={drop} className={classList(`splits-overlay-${side}`, over && 'over')} />
}

const sides: Side[] = ['top','bottom','left','right'];

/**
 * Create a node for the {@link Splits} definition tree.
 * @category Splits
 * @param axis In which direction to lay out the children
 * @param children Sub-elements or subcontainers and their relative sizes.
 * @returns 
 */
export function getSplitData<T>(axis: Axis, children: SplitChild<T>[]): SplitData<T> {
    return { TYPE_ID: "SplitData", axis, children };
}

/**
 * Identifies subcontainer definitions in contrast to other objects. It uses a
 * TYPE_ID field so that it works in scenarios where runtime type assertions
 * like `instanceof`, `in` and `Object` methods don't, like Immer drafts.
 * @category Splits
 * @param x 
 * @returns whether `x` is a subcontainer definition
 */
export function isSplitData<T = ReactNode>(x: SplitData<T> | T): x is SplitData<T> {
    const sd = x as SplitData<T>;
    return sd.TYPE_ID == 'SplitData';
}

export default Splits;

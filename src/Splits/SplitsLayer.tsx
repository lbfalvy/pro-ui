import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { addXY, classList } from "../utils";
import { ResizeItem } from "./Splits.types";

const SplitsLayer: React.FC<{}> = () => {
    const [
        item,
        start,
        delta
    ] = useDragLayer(monitor => [
        monitor.getItem() as ResizeItem | null,
        monitor.getInitialSourceClientOffset(),
        monitor.getDifferenceFromInitialOffset()
    ]);
    if (!item || !start || !delta) return null;
    const drawPos = addXY(start, delta);
    const otherAxis = item.axis == 'x' ? 'y' : 'x';
    drawPos[otherAxis] = start[otherAxis];
    item.position = drawPos;
    return <div style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    }}>
        <div className={classList({
            'splits-ghost-border': true,
            [`splits-ghost-border-${item.axis}`]: true
        })} style={{
            width: `${item.width}px`,
            height: `${item.height}px`,
            top: `${drawPos.y}px`,
            left: `${drawPos.x}px`
        }}></div>
    </div>
}

export default SplitsLayer;
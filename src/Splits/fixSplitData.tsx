import { XYCoord } from "react-dnd";
import { maxIndex, sum } from "../utils";
import { isSplitData } from "./Splits";
import { SplitChild, SplitData, SplitSubdata } from "./Splits.types";

/**
 * Makes sure that
 * 1. The sum of the array is 1
 * 2. None of the elements are smaller than the minimum
 * 
 * If the array is too large to satisfy #2, the elements are made equal.
 * @param ratios List of numbers
 * @param minimum 
 * @returns Fixed list
 */
function fixRatios(ratios: readonly (number | undefined)[], minimum: number): readonly number[] {
    // If it's unsolvably small, return the closest to correct
    if (minimum * ratios.length > 1) return ratios.map(() => 1 / ratios.length);
    // Make sure that all sizes are defined and at least as great as the minimum size
    const sizesInProgress = ratios.map(s => Math.max(minimum, s ?? 0));
    // While the sizes are too big, keep shrinking the largest element.
    while (sum(sizesInProgress) > 1) {
        const i = maxIndex(sizesInProgress);
        sizesInProgress[i] = Math.max(minimum, sum(sizesInProgress) - 1);
    }
    // If the sizes are too small, grow the smallest element to fill the rest
    // They could share equally, but this function is already way too complex tbh.
    if (sum(sizesInProgress) < 1) {
        const i = maxIndex(sizesInProgress.map(x => -x));
        sizesInProgress[i] += 1 - sum(sizesInProgress)
    }
    return sizesInProgress;
}

interface HalfFixedSplitChild<T> {
    ratio: number,
    content: SplitSubdata<T>
}

/**
 * Fixes the children using {@link fixRatios}. Reference-preserving
 * @param children Array of children
 * @param minRatio Minimum ratio value allowed
 * @returns 
 */
function fixChildRatios<T>(
    children: SplitChild<T>[],
    minRatio: number
): HalfFixedSplitChild<T>[] {
    if (children.length == 0) return children as [];
    const sizes = children.map(c => c.ratio);
    const fixedSizes = fixRatios(sizes, minRatio);
    const didSizesChange = fixedSizes.some((s, i) => s !== sizes[i]);
    if (didSizesChange) return children.map((c, i) => ({ ...c, ratio: fixedSizes[i] }));
    return children as HalfFixedSplitChild<T>[];
}

/**
 * Calculates the bounding box of the given child.
 * @param def 
 * @param childNo 
 * @param box Parent's bounding box
 * @param border Border width
 * @returns 
 */
function getChildBox(
    def: SplitData<any>,
    childNo: number,
    box: XYCoord,
    border: number
): XYCoord {
    const childBox = {...box};
    const ratio = def.children[childNo].ratio;
    const childSize = (box[def.axis] - (def.children.length - 1) * border) * ratio;
    childBox[def.axis] = childSize;
    return childBox
}

/**
 * Fixes the sizes in a split tree to negate problems like negative width that
 * emerge from naiive implementations of other transformations.
 * @param def 
 * @param minSize Minimum allowed size of a split
 * @param box Bounding box of `def`
 * @param border Border width
 */
export default function fixSplitSizes<T>(
    def: SplitData<T>,
    minSize: number,
    box: XYCoord,
    border?: number
): SplitData<T>;
export default function fixSplitSizes<T>(
    def: T,
    minSize: number,
    box: XYCoord,
    border?: number
): T;
export default function fixSplitSizes<T>(
    def: SplitData<T>,
    minSize: number,
    box: XYCoord,
    border: number = 5
): SplitData<T> | T {
    // If the box is broken the component hadn't loaded properly yet, don't
    // waste time on this function.
    if (box.x <= 0 || box.y <= 0) return def;
    // There's nothing to fix on a ReactNode
    if (!isSplitData<T>(def)) return def;
    // Size along the layout axis
    const size = box[def.axis];
    // Fix sizes
    const fixedSizeChildren = fixChildRatios<T>(def.children, minSize / size);
    let anyChanged = fixedSizeChildren !== def.children;
    // Fix children recursively
    const fixedChildren = fixedSizeChildren.map<SplitChild<T>>(({ content, ...rest }, i) => {
        const fixedContent = fixSplitSizes(
            content,
            minSize,
            getChildBox(def, i, box, border),
            border
        );
        anyChanged ||= fixedContent !== content;
        return { ...rest, content: fixedContent };
    });
    // If nothing changed, return the same object.
    if (anyChanged) {
        return { ...def, children: fixedChildren };
    } else return def;
}

/**
 * Normalises the array to only contain React nodes and perpendicular,
 * non-empty containers. Reference-preserving
 * @param direction The direction the array will be laid out
 * @param children Array to be laid out
 * @returns 
 */
function inlineAligned<T>(
    direction: SplitData['axis'],
    children: SplitChild<T>[]
): SplitChild<T>[] {
    let anyChanged = false;
    const result = children.map(child => {
        // If it's plain React, or a split along a different axis and not empty,
        // wrap it alone to protect from the flat(1) in case T extends Array
        if (!isSplitData(child.content) 
            || child.content.axis != direction
            && child.content.children.length > 1) {
            return [child];
        }
        anyChanged = true;
        // If it's along the same axis or along the cross axis but empty or just one element,
        // split it up. For cross-axis empty containers, this will just
        // yield an empty array and be eliminated in the next step.
        return child.content.children.map(grandc => ({
            ...grandc,
            ratio: child.ratio * grandc.ratio
        }));
    }).flat(1);
    return anyChanged ? result : children;
}

/**
 * Inline children of the same axis and remove empty containers from the tree.
 * @param def 
 */
export function fixSplitTree<T>(def: SplitData<T>, filterLeaves?: (t: T) => boolean): SplitData<T>
export function fixSplitTree<T>(def: SplitSubdata<T>, filterLeaves?: (t: T) => boolean): SplitSubdata<T>
export function fixSplitTree<T>(def: SplitSubdata<T>, filterLeaves: (t: T) => boolean = () => true): SplitSubdata<T> {
    // There's nothing to fix on a ReactNode
    if (!isSplitData<T>(def)) {
        return def;
    }
    let anyChanged = false;
    const shallowAbnormal = def.children
        .filter(({ content }) => isSplitData<T>(content) || filterLeaves(content))
        .map(({ content, ...rest }) => {
            const normal = fixSplitTree(content, filterLeaves);
            anyChanged ||= normal !== content;
            return { ...rest, content: normal };
        });
    anyChanged ||= shallowAbnormal.length !== def.children.length;
    // Normalise children, update anyChanged if necessary
    const normal = inlineAligned(def.axis, shallowAbnormal);
    if (normal === def.children) return def;
    return {
        ...def,
        children: normal
    }
}
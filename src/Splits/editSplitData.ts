import produce, { Draft } from "immer";
import { getSplitData, isSplitData } from "./Splits";
import { Axis, Side, SplitChild, SplitData, SplitSubdata, SplitSubdataFunction } from "./Splits.types";

/**
 * Traverses the tree and returns the node at the end of the path  
 * Use for reading and with immer
 * @param data 
 * @param path 
 * @returns
 */
export function traverseSplitTree<T>(data: SplitSubdata<T>, path: number[]): SplitSubdata<T> {
    if (path.length == 0) return data;
    if (!isSplitData(data)) throw new Error('Cannot subdivide leaf');
    if (path[0] < 0 || data.children.length <= path[0]) throw new Error('Path leads out of bounds');
    return traverseSplitTree(data.children[path[0]].content, path.slice(1));
}

/**
 * Transforms the node at the end of the path with your callback then returns
 * an immutable copy of the whole tree.  
 * Use when you might create a new node.
 * 
 * It can be guaranteed to return a SplitData iff the predicate is guaranteed
 * to return a SplitData or the path is guaranteed to be non-empty
 * @param data 
 * @param path 
 * @param predicate 
 */
export function editSplitData<T, U extends SplitSubdata<T> = SplitSubdata<T>>(
    data: SplitSubdata<T>, path: number[],
    predicate: (x: SplitSubdata<T>) => (U & SplitData<T>)
): SplitData<T>
export function editSplitData<T, U extends SplitSubdata<T> = SplitSubdata<T>>(
    data: SplitSubdata<T>, path: number[],
    predicate: (x: SplitSubdata<T>) => U
): SplitSubdata<T>
export function editSplitData<T, U extends SplitSubdata<T>>(
    data: SplitSubdata<T>,
    path: number[],
    predicate: (x: SplitSubdata<T>) => U
): SplitData<T | U> | U {
    if (0 < path.length) {
        if (!isSplitData(data)) throw new Error('Path refers to child of leaf');
        if (data.children.length <= path[0] || path[0] < 0) throw new Error('Path leads out of bounds');
        const subdata = data.children[path[0]].content;
        // Only change the subdata, everything else is preserved.
        const temp = editSplitData<T, U>(subdata, path.slice(1), predicate);
        if (temp == subdata) return data; 
        return produce(data, draft => {
            draft.children[path[0]].content = temp as Draft<SplitData<T>> | Draft<T>;
        });
    }
    return predicate(data);
}

/**
 * Moves a border in the grid. This may leave negative sized cells and other
 * artifacts so call fixSplitSizes on the result.
 * @param data 
 * @param path 
 * @param index Index of the node before (left/up) the moved border
 * @param amount Change, in relation to the parent's appropriate dimension
 * @returns 
 */
export function resizeSplit<T>(
    data: SplitData<T>,
    path: number[],
    index: number,
    amount: number
): SplitData<T> {
    return produce(data, draft => {
        const sub = traverseSplitTree(draft, path);
        if (!isSplitData(sub)) throw new Error('Cannot subdivide leaf');
        if (sub.children.length <= index + 1 || index < 0)
            throw new Error('Index is out of bounds');
        sub.children[index].ratio += amount;
        sub.children[index + 1].ratio -= amount;
    });
}

/**
 * Splits a tree node. This may leave parallel child containers and other
 * artifacts on the tree, so call {@link fixSplitTree} after you're finished
 * with the transformations. Additionally, because it moves a subtree, use
 * {@link transposeSplitTree} to update all affected if you are storing the
 * access paths in the nodes.
 * @param data 
 * @param path 
 * @param side 
 * @param fresh The node to be inserted
 * @returns 
 */
export function subdivideSplit<T>(
    data: SplitSubdata<T>,
    path: number[],
    side: Side,
    fresh: SplitSubdata<T>
): SplitData<T> {
    const vertical = side == 'bottom' || side == 'top';
    const before = side == 'top' || side == 'left';
    return editSplitData<T, SplitData<T>>(data, path, data => getSplitData(vertical ? 'y' : 'x', [{
        ratio: 0.5,
        content: (before ? fresh : data)
    }, {
        ratio: 0.5,
        content: (before ? data : fresh)
    }]));
}

/**
 * Recursively visits every node in the specified subtree with the correct
 * full path and the old leaf. Use this to update any stored instances of the
 * access path after tree transformations like executeSplit and fixTopology
 * @param data 
 * @param path 
 * @param callback
 */
export function transposeSplitTree<T, U>(data: SplitData<T>, path: null, callback: (fullPath: number[], leaf: T) => U): SplitData<U>;
export function transposeSplitTree<T, U extends SplitSubdata<T>>(data: SplitData<T>, path: number[], callback: (fullPath: number[], leaf: T) => U): SplitData<T | U>;
export function transposeSplitTree<T, U>(data: SplitSubdata<T>, path: null, callback: (fullPath: number[], leaf: T) => U): SplitSubdata<U>;
export function transposeSplitTree<T, U extends SplitSubdata<T>>(data: SplitSubdata<T>, path: number[], callback: (fullPath: number[], leaf: T) => U): SplitSubdata<T | U>;
export function transposeSplitTree<T, U>(data: SplitSubdata<T>, path: null | number[], callback: (fullPath: number[], leaf: T) => U): SplitSubdata<T | U> {
    if (!path || path.length == 0) return recursivelyTransposeTree(data, [], callback);
    /** @TODO figure out how to explain this to TypeScript. */
    return editSplitData<T, any>(
        data, path,
        child => recursivelyTransposeTree<T, U>(child, path, callback)
    );
}
function recursivelyTransposeTree<T, U = T>(
    data: SplitSubdata<T>,
    fullPath: number[],
    callback: (fullPath: number[], leaf: T) => U
): SplitSubdata<U> {
    if (!isSplitData(data)) return callback(fullPath, data);
    let anyChanged = false;
    const fixedChildren = data.children.map((child, i) => {
        const fixed = recursivelyTransposeTree(child.content, [...fullPath, i], callback);
        anyChanged ||= fixed as unknown !== child.content;
        return { ...child, content: fixed };
    });
    if (!anyChanged) return data as unknown as SplitData<U>;
    return {
        ...data,
        children: fixedChildren
    };
}
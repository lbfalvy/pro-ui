import { editSplitData, resizeSplit, subdivideSplit, transposeSplitTree, traverseSplitTree } from "./editSplitData";
import fixSplitSizes, { fixSplitTree } from "./fixSplitData";
import Splits from './Splits';
import SplitsLayer from './SplitsLayer';

export {
    Splits as default,
    // General tree manipulator functions
    traverseSplitTree, editSplitData, transposeSplitTree,
    // alter ratios
    resizeSplit, fixSplitSizes,
    // alter topology
    subdivideSplit, fixSplitTree,
    SplitsLayer
};
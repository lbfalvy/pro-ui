// Generated with util/create-component.js
import React from "react";
import ContextMenu from "./ContextMenu";
import { Option } from './ContextMenu.types';

export default {
    title: "ContextMenu"
};

export function BasicUsage(): React.ReactElement {
    return <ContextMenu options={[
        ['foo', () => alert('foo')],
        ['suboptions', [
            ['sub1', () => alert('bar')],
            ['And I really really really really really really want to know', null]
        ]]
    ]}>
        This text has a custom context menu
    </ContextMenu>
}

export function MultipleProviders(): React.ReactElement {
    const [red, toggleRed] = React.useReducer(s => !s, false);
    const [underlined, toggleUline] = React.useReducer(s => !s, false);
    return <ContextMenu options={[['Toggle redness', toggleRed]]}
            style={{ color: red ? 'red' : 'white' }}>
        This text can be red, however
        <ContextMenu options={[['Toggle underline', toggleUline]]}
                style={{ textDecoration: underlined ? 'underline' : 'none' }}>
            This text has an additional option to be underlined.
        </ContextMenu>
        This can be stacked multiple times.
    </ContextMenu>
}
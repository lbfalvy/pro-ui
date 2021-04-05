# Pro UI Components

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

This package contains components to build UIs for experts. All components lend
themselves to modification by the user. To align with this principle, you
should store the user preferences somewhere, at least in LocalStorage.

All components use react-dnd, so you have to wrap them in

```JSX
<DndProvider backend={HTML5Backend}>
  ...
</DndProvider>
```

instances. You don't have to have a single big DndProvider, but you have to
make sure that every source and the corresponding target are under the same
DndProvider.

## Components

### Tabs

A tabbed container that allows to reorganise tabs with drag-and-drop, even
between containers. It takes an array of tab definitions as its children.

```TS
interface TabData<T> {
  id: string | number
  title: ReactNode
  children: ReactNode
  metadata?: T
}
```

It is important that `id` be unique with respect to any group of `Tabs`
elements within which movement is allowed because it is used for the `key`
prop of tabs and contents alike. `id` and `metadata` together serve to identify
the tab to your own code, so you should probably encode how to locate the
`Tabs` element in `metadata`.

Usage:

```JSX
<Tabs onMove={(position: number, id: string | number, metadata: any) => void}>
  {[
    {
      id: 0,
      title: 'Title of first tab',
      children: <div>Contents of first tab</div>,
      metadata: { some: 'data' }
    },
    {
      id: 'foo',
      title: <>Title of <em>another</em> tab</>,
      children: <div>Components of another tab</div>
    }
  ]}
</Tabs>
```

`id` can be either a string or a number. When the user moves a tab, `onMove` is
called on the target container, with the following arguments:

- the position the tab should be moved to
- the ID of the moved tab
- the metadata of the moved tab

The children won't be moved by themselves, you have to store your children in
an appropriate structure and handle the onMove event in the parent component.
For an example of how this could be done, see the story in the docs.

### Splits

It is a container made of a tree of flexboxes, inspired by Visual Studio and
the Unity editor. It takes a tree of split definitions as its children

```TS
interface SplitData {
  axis: 'x' | 'y'
  children: {
    ratio: number
    content: SplitData | ReactNode
  }[]
}
```

The component itself is called like so

```TSX
<Splits minSize={number} splitTypes={string|string[]}
  onResize={(path: number[], after: number, amount: number) => void}
  onSplit={(path: number[], side: 'top'|'left'|'bottom'|'right', item: any, type: string) => void}>
  {children: SplitData}
</Splits>
```

There are a number of functions to help with transforming the tree, for a complete list, see the docs.

Documentation: https://lbfalvy.github.io/pro-ui/docs
See it in action at https://lbfalvy.github.io/pro-ui

Library created from [This template by HarveyD](https://github.com/HarveyD/react-component-library)

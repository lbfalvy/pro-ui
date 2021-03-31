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
A tab definition has an `id` which is a string or a number, a `title` which is
a valid React child, a `children` property which will be the body of the tab,
and optionally a `metadata` property that can be used to store where the tab
can be found in a more complex state management solution.

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
called on the target container, with

- the position the tab should be moved to as the first argument,
- the ID of the moved tab as the second and
- the metadata of the moved element as the third.

The children won't be moved by themselves, you have to store your children in
an appropriate structure and handle the onMove event in the parent component.
For an example of how this could be done, see the relevant story in the docs.

See it in action at https://lbfalvy.github.io/pro-ui

Library created from [This template by HarveyD](https://github.com/HarveyD/react-component-library)

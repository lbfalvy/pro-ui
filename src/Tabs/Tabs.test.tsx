// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import Tabs from "./Tabs";
import { TabsProps } from "./Tabs.types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("Test Component", () => {
  let props: TabsProps;

  beforeEach(() => {
    props = {
      children: [
        [0, 'tab0', 'content0'],
        [1, 'tab1', 'content1'],
        [2, 'tab2', 'content2']
      ]
    };
  });

  const renderComponent = () => render(
    <DndProvider backend={HTML5Backend}>
      <Tabs {...props} />
    </DndProvider>);

  it("should render correctly", () => {
    const { getByTestId } = renderComponent();

    const component = getByTestId("Tabs");

    expect(component).toHaveTextContent("tab0tab1tab2content0content1content2");
  });
});

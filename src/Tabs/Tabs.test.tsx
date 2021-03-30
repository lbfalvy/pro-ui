// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import Tabs from "./Tabs";
import { TabsProps } from "./Tabs.types";

describe("Test Component", () => {
  let props: TabsProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<Tabs {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Tabs");

    expect(component).toHaveTextContent("harvey was here");
  });
});

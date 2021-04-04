// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import Splits from "./Splits";
import { SplitsProps } from "./Splits.types";

describe("Test Component", () => {
  let props: SplitsProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<Splits {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("Splits");

    expect(component).toHaveTextContent("harvey was here");
  });
});

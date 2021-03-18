import React from "react";
import { render } from "@testing-library/react";
import { FormError } from "../form-error";

describe('<FormError/>', () => {
  it('renders OK with props', () => {
    const { getByText, debug } = render(<FormError errorMessage="test" />);
    getByText('test');
  });
});
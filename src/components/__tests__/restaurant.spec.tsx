import React from "react";
import { render } from "@testing-library/react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe('<Restaurant/>', () => {
  it('renders OK with props', () => {
    const restaurantProps = {
      id: '1',
      name: 'name',
      coverImg: 'image',
      categoryName: 'cate',
    }
    const { getByText, debug, container } = render(
      <Router>
        <Restaurant {...restaurantProps}/>
      </Router>
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurants/${restaurantProps.id}`
    );
  });
});
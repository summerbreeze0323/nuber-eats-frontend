import React from "react";
import { render, waitFor } from "../../test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { NotFound } from "../404";

describe('<NotFound/>', () => {
  it('renders OK', async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound/>
        </Router>
      </HelmetProvider>
    );
    render(<NotFound/>);
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Nuber Eats');
    });
  });
})

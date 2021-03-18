import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { NotFound } from "../../pages/404";

describe('<NotFound/>', () => {
  it('renders OK', async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound/>
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Nuber Eats');
    });
  });
})

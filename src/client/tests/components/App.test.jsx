import { render, screen } from '@testing-library/react';

import App from '../../App';

test('It renders', () => {
  render(<App />);

  expect(screen.getByTestId("App")).toBeInTheDocument()
})
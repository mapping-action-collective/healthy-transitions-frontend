import { render, screen } from '@testing-library/react';
import Page from './Page';

test('renders header home nav link', () => {
  render(<Page />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});

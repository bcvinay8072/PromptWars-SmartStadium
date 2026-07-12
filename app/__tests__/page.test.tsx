import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Landing Page', () => {
  it('renders the main heading', () => {
    render(<Page />);
    expect(screen.getByText('Nexus26')).toBeInTheDocument();
  });

  it('renders the role selection cards', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: 'Enter as a Fan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enter as Venue Staff' })).toBeInTheDocument();
  });
});

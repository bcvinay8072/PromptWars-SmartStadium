import { render, screen, fireEvent } from '@testing-library/react';
import { FanDashboard } from '../FanDashboard';

describe('FanDashboard', () => {
  it('renders the AI Assistant tab as active by default', () => {
    render(<FanDashboard />);
    const chatBtn = screen.getByRole('button', { name: /AI Assistant/i });
    expect(chatBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders the dashboard navigation', () => {
    render(<FanDashboard />);
    expect(screen.getByRole('navigation', { name: 'Fan dashboard navigation' })).toBeInTheDocument();
  });

  it('switches to Navigate tab and shows navigation cards', () => {
    render(<FanDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Navigate/i }));
    expect(screen.getByText('Restrooms')).toBeInTheDocument();
    expect(screen.getByText('Food Court')).toBeInTheDocument();
    expect(screen.getByText('First Aid')).toBeInTheDocument();
  });

  it('switches to Transport tab and shows transport info', () => {
    render(<FanDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Transport/i }));
    expect(screen.getByText('Metro Line 4')).toBeInTheDocument();
    expect(screen.getByText('Shuttle Bus S2')).toBeInTheDocument();
  });

  it('shows accessibility information in navigate tab', () => {
    render(<FanDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Navigate/i }));
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });

  it('shows parking status in transport tab', () => {
    render(<FanDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Transport/i }));
    expect(screen.getByText(/Parking P3/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Full/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays stadium occupancy percentage in transport tab', () => {
    render(<FanDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /Transport/i }));
    expect(screen.getByText(/Stadium Occupancy/i)).toBeInTheDocument();
  });
});

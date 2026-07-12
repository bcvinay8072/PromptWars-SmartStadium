import { render, screen } from '@testing-library/react';
import { StaffDashboard } from '../StaffDashboard';

describe('StaffDashboard', () => {
  it('renders the system status indicator', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
  });

  it('renders the Live badge', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('shows overview tab by default', () => {
    render(<StaffDashboard />);
    const overviewBtn = screen.getByRole('button', { name: /Live Overview/i });
    expect(overviewBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('displays attendance metric', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('78,421')).toBeInTheDocument();
  });

  it('displays gate wait metric with warning status', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('Gate C Wait')).toBeInTheDocument();
  });

  it('displays active incidents metric', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
  });

  it('has staff dashboard navigation', () => {
    render(<StaffDashboard />);
    expect(screen.getByRole('navigation', { name: 'Staff dashboard navigation' })).toBeInTheDocument();
  });

  it('displays capacity percentage', () => {
    render(<StaffDashboard />);
    expect(screen.getByText('Capacity')).toBeInTheDocument();
    expect(screen.getByText(/90%/)).toBeInTheDocument();
  });
});

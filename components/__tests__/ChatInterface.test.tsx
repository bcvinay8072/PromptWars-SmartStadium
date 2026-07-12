import { render, screen } from '@testing-library/react';
import { ChatInterface } from '../ChatInterface';

describe('ChatInterface', () => {
  it('renders the chat log with ARIA attributes', () => {
    render(<ChatInterface />);
    const chatLog = screen.getByRole('log', { name: 'Chat messages' });
    expect(chatLog).toBeInTheDocument();
    expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });

  it('renders the welcome message for fan context', () => {
    render(<ChatInterface context="fan" />);
    expect(screen.getByText(/Welcome to Nexus26/)).toBeInTheDocument();
  });

  it('renders the welcome message for staff context', () => {
    render(<ChatInterface context="staff" />);
    expect(screen.getByText(/Nexus26 Ops ready/)).toBeInTheDocument();
  });

  it('renders the message input with proper label', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('textbox', { name: 'Message input' })).toBeInTheDocument();
  });

  it('renders the send button', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInterface />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('has a max length of 1000 on the input', () => {
    render(<ChatInterface />);
    const input = screen.getByRole('textbox', { name: 'Message input' });
    expect(input).toHaveAttribute('maxLength', '1000');
  });
});

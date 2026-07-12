'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { sanitizeInput } from '@/lib/utils';

/**
 * Represents a single chat message in the conversation.
 * @example
 * const msg: Message = { role: 'user', content: 'Where are the restrooms?' };
 */
export interface Message {
  /** The sender of the message */
  role: 'user' | 'assistant';
  /** The text content of the message */
  content: string;
}

/**
 * Props for the ChatInterface component.
 * @example
 * <ChatInterface context="fan" />
 */
export interface ChatInterfaceProps {
  /** Whether this chat is used in fan or staff context */
  context?: 'fan' | 'staff';
}

/**
 * A real-time chat interface component that connects to the GenAI backend.
 * Features streaming-like UX, input sanitization, and full ARIA accessibility.
 *
 * @param props - The component props
 * @returns The rendered chat interface
 * @example
 * <ChatInterface context="fan" />
 */
export const ChatInterface = ({ context = 'fan' }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: context === 'staff'
        ? '🎯 Nexus26 Ops ready. Ask about crowd flow, incidents, or resource allocation.'
        : '👋 Welcome to Nexus26! Ask me about stadium navigation, food, transport, or accessibility.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Scrolls the chat log to the newest message */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * Handles form submission — sanitizes input, sends to API, and updates messages.
   * @param e - The form submit event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const sanitized = sanitizeInput(input);
    const newMessages: Message[] = [...messages, { role: 'user', content: sanitized }];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You are sending messages too quickly. Please wait a moment.');
        }
        throw new Error('Failed to get response');
      }

      const data: { message: string } = await response.json();
      const sanitizedResponse = sanitizeInput(data.message);

      setMessages((prev) => [...prev, { role: 'assistant', content: sanitizedResponse }]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, something went wrong: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col glass-panel overflow-hidden h-chat animate-fadeIn">
      <div
        className="flex-1 overflow-y-auto p-lg flex flex-col gap-sm"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="chat-bubble chat-bubble-assistant text-muted loading-dots"
          >
            Thinking
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-sm p-md border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={context === 'staff' ? 'Ask about operations...' : 'Ask me anything about the stadium...'}
          className="chat-input flex-1"
          disabled={isLoading}
          aria-label="Message input"
          maxLength={1000}
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
};

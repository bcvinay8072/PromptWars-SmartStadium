import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nexus26 - Smart Stadium Assistant',
  description: 'GenAI-enabled solution for the FIFA World Cup 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ErrorBoundary>
          <div id="main-content">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}

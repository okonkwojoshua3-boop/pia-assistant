import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PIA 2021 — AI Legal Assistant',
  description:
    'Read and query the Petroleum Industry Act 2021 with AI-powered search and exact section citations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-100`}>{children}</body>
    </html>
  );
}

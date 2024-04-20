import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Stats of America',
	description: 'United we stand, divided we fall; we are bound by statistics.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className="bg-gray-800" lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}

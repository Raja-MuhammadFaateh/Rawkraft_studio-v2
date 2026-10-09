import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RawKraft Studio | Bespoke Handcrafted Furniture & Live-Edge Slabs',
  description:
    'Premium bespoke furniture studio website with interactive catalog, custom piece configurator, WhatsApp brief builder, and studio AI design consultant.',
  openGraph: {
    title: 'RawKraft Studio | Bespoke Handcrafted Furniture & Live-Edge Slabs',
    description:
      'Premium bespoke furniture studio website with interactive catalog, custom piece configurator, WhatsApp brief builder, and studio AI design consultant.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RawKraft Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RawKraft Studio | Bespoke Handcrafted Furniture & Live-Edge Slabs',
    description:
      'Premium bespoke furniture studio website with interactive catalog, custom piece configurator, WhatsApp brief builder, and studio AI design consultant.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0f1012] text-neutral-100 antialiased selection:bg-[#c89d66] selection:text-[#0f1012]">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

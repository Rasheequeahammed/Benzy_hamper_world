import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { MobileNav } from '@/components/MobileNav';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Hamper World | Crafting Memories',
    description: 'Exquisite hampers for weddings, engagements, and festive celebrations. Based in Kerala since 2002.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={cn(
                "min-h-screen font-sans",
                inter.variable,
                playfair.variable
            )}>
                <CartProvider>
                    <Navbar />
                    <CartDrawer />
                    <MobileNav />
                    <main className="flex-grow pb-20 md:pb-0">
                        {children}
                    </main>
                    <Footer />
                </CartProvider>
            </body>
        </html>
    );
}

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3x3, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function MobileNav() {
    const pathname = usePathname();
    const { openCart, totalItems } = useCart();

    const navItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Catalog', href: '/#collection', icon: Grid3x3 },
        { label: 'Search', href: '/search', icon: Search },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white/95 backdrop-blur-lg border-t border-brand-primary/10 px-6 sm:px-12 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 transition-all duration-300 transform",
                            isActive ? "text-brand-accent scale-110" : "text-brand-primary/40 hover:text-brand-primary"
                        )}
                    >
                        <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {item.label}
                        </span>
                    </Link>
                );
            })}

            {/* Cart Button */}
            <button
                onClick={openCart}
                className="flex flex-col items-center justify-center gap-1 text-brand-primary/40 hover:text-brand-primary relative transition-transform active:scale-90"
            >
                <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[8px] font-bold text-white ring-2 ring-white">
                            {totalItems}
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Cart</span>
            </button>
        </div>
    );
}

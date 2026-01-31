"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import Image from 'next/image';

export function Navbar() {
    const { openCart, totalItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleInquiry = () => {
        const whatsappNumber = "919526689880";
        const message = encodeURIComponent("Hello Hamper World! I'm interested in your gift hampers.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-brand-primary/10 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">

                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-brand-primary/5 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                            <span className="font-serif text-2xl text-brand-primary">H</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-serif font-bold tracking-widest text-brand-primary hidden sm:block group-hover:text-brand-accent transition-colors">
                                HAMPER WORLD
                            </span>
                            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gray-500 hidden sm:block">
                                Crafting Memories
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-8 items-center text-sm font-medium text-brand-primary/80">
                        <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                        <Link href="/#collection" className="hover:text-brand-primary transition-colors">Collection</Link>
                        <Link href="/about" className="hover:text-brand-primary transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-brand-primary transition-colors">Contact</Link>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <SearchBar />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">

                        <button
                            onClick={openCart}
                            className="relative p-2 text-brand-primary hover:text-brand-accent transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleInquiry}
                            className="hidden md:block bg-brand-primary text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-brand-dark transition-colors duration-300"
                        >
                            Inquire Now
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-brand-primary"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-brand-primary/10 shadow-xl py-4 flex flex-col animate-in slide-in-from-top-2">
                    {/* Mobile Search */}
                    <div className="px-6 pb-4 mb-2 border-b border-gray-100">
                        <SearchBar />
                    </div>
                    <Link
                        href="/"
                        className="px-6 py-3 text-brand-primary hover:bg-gray-50 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/#collection"
                        className="px-6 py-3 text-brand-primary hover:bg-gray-50 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Collection
                    </Link>
                    <Link
                        href="/about"
                        className="px-6 py-3 text-brand-primary hover:bg-gray-50 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="px-6 py-3 text-brand-primary hover:bg-gray-50 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    <div className="px-6 pt-4 mt-2 border-t border-gray-100">
                        <button
                            onClick={handleInquiry}
                            className="w-full bg-brand-primary text-white py-3 text-center uppercase text-sm tracking-widest"
                        >
                            Inquire Now
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

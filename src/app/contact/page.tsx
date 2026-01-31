"use client";

import { Phone, Mail, Clock, MapPin, MessageCircle, Instagram } from 'lucide-react';

export default function ContactPage() {
    const whatsappNumber = "919526689880"; // +91 9526689880
    const displayPhone = "+91 95266 89880";

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("Hello Hamper World! I'm interested in your gift hampers.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-accent/10">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-accent/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-brand-primary/20 to-transparent" />
                </div>

                <div className="container relative z-10 px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-primary mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-brand-primary/70 max-w-2xl mx-auto">
                        We're here to help with all your gifting needs
                    </p>
                    <div className="h-1 w-20 bg-brand-accent mx-auto mt-8" />
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">

                        {/* WhatsApp Card */}
                        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-sm shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-brand-primary">
                                    WhatsApp
                                </h3>
                            </div>
                            <p className="text-brand-primary/70 mb-4">
                                Fastest way to reach us for hamper inquiries
                            </p>
                            <p className="text-2xl font-bold text-green-600 mb-4">
                                {displayPhone}
                            </p>
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full bg-green-500 text-white px-6 py-3 font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Message on WhatsApp
                            </button>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-gradient-to-br from-brand-light/30 to-white p-8 rounded-sm shadow-lg border border-brand-primary/10 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-brand-primary">
                                    Phone
                                </h3>
                            </div>
                            <p className="text-brand-primary/70 mb-4">
                                Call us for immediate assistance
                            </p>
                            <p className="text-2xl font-bold text-brand-accent mb-4">
                                {displayPhone}
                            </p>
                            <a
                                href={`tel:${displayPhone}`}
                                className="block w-full bg-brand-accent text-white px-6 py-3 font-medium hover:bg-brand-primary transition-colors text-center"
                            >
                                Call Now
                            </a>
                        </div>

                        {/* Email Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-sm shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-brand-primary">
                                    Email
                                </h3>
                            </div>
                            <p className="text-brand-primary/70 mb-4">
                                Send us your bulk order requirements
                            </p>
                            <p className="text-lg font-medium text-blue-600 mb-4">
                                benzydutyfreeshop@gmail.com
                            </p>
                            <a
                                href="mailto:benzydutyfreeshop@gmail.com"
                                className="block w-full bg-blue-500 text-white px-6 py-3 font-medium hover:bg-blue-600 transition-colors text-center"
                            >
                                Send Email
                            </a>
                        </div>

                        {/* Instagram Card */}
                        <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-sm shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <Instagram className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-brand-primary">
                                    Instagram
                                </h3>
                            </div>
                            <p className="text-brand-primary/70 mb-4">
                                Follow us for updates and new arrivals
                            </p>
                            <p className="text-lg font-medium text-pink-600 mb-4">
                                @hamper.world_
                            </p>
                            <a
                                href="https://www.instagram.com/hamper.world_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 font-medium hover:from-purple-600 hover:to-pink-600 transition-colors text-center"
                            >
                                Follow Us
                            </a>
                        </div>
                    </div>

                    {/* Business Hours & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Business Hours */}
                        <div className="bg-brand-light/20 p-8 rounded-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <Clock className="w-8 h-8 text-brand-accent" />
                                <h3 className="text-2xl font-serif font-bold text-brand-primary">
                                    Business Hours
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-brand-primary/70 font-medium">Monday - Sunday</span>
                                    <span className="text-brand-primary font-bold">10:00 AM - 2:00 AM</span>
                                </div>
                                <div className="text-sm text-brand-primary/50 mt-4 pt-4 border-t border-brand-primary/10">
                                    Open 7 days a week for your convenience
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-brand-light/20 p-8 rounded-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <MapPin className="w-8 h-8 text-brand-accent" />
                                <h3 className="text-2xl font-serif font-bold text-brand-primary">
                                    Visit Our Showroom
                                </h3>
                            </div>
                            <p className="text-brand-primary/70 mb-4">
                                Thalassery, Kannur<br />
                                Kerala, India
                            </p>
                            <a
                                href="https://maps.google.com/?q=Thalassery,Kannur,Kerala"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border-2 border-brand-primary px-6 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300"
                            >
                                GET DIRECTIONS
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                        Ready to Place Your Order?
                    </h2>
                    <p className="text-white/90 text-lg mb-8">
                        Browse our catalog and add items to cart. Send us your wholesale inquiry via WhatsApp instantly!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/"
                            className="inline-block bg-white text-brand-primary px-8 py-4 text-sm font-bold tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300"
                        >
                            BROWSE CATALOG
                        </a>
                        <button
                            onClick={handleWhatsAppClick}
                            className="inline-block bg-green-500 text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WHATSAPP US
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

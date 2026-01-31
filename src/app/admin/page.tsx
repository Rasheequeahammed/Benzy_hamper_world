"use client";

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye, Calendar, Lock } from 'lucide-react';

interface Event {
    id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    theme: {
        primaryColor: string;
        accentColor: string;
        bannerBg?: string;
    };
    banner: {
        text: string;
        link?: string;
        dismissible?: boolean;
    };
    discountPercent: number;
    heroOverride?: {
        headline?: string;
        tagline?: string;
    };
}

interface EventConfig {
    events: Event[];
    defaultTheme: {
        primaryColor: string;
        accentColor: string;
    };
}

const ADMIN_PIN = "Benzy@12";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');
    const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // Check authentication
    useEffect(() => {
        const auth = sessionStorage.getItem('admin_authenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Load events
    useEffect(() => {
        if (isAuthenticated) {
            fetchEvents();
        }
    }, [isAuthenticated]);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            setEventConfig(data);
        } catch {
            console.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput === ADMIN_PIN) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_authenticated', 'true');
            setPinError('');
        } else {
            setPinError('Incorrect PIN');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
        setPinInput('');
    };

    const saveEvents = async (updatedConfig: EventConfig) => {
        setSaveStatus('saving');
        try {
            await fetch('/api/events', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedConfig),
            });
            setEventConfig(updatedConfig);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
            setSaveStatus('error');
        }
    };

    const toggleEventActive = async (eventId: string) => {
        if (!eventConfig) return;
        const updated = {
            ...eventConfig,
            events: eventConfig.events.map(e =>
                e.id === eventId ? { ...e, isActive: !e.isActive } : e
            ),
        };
        await saveEvents(updated);
    };

    const deleteEvent = async (eventId: string) => {
        if (!eventConfig || !confirm('Are you sure you want to delete this event?')) return;
        const updated = {
            ...eventConfig,
            events: eventConfig.events.filter(e => e.id !== eventId),
        };
        await saveEvents(updated);
    };

    const createNewEvent = (): Event => ({
        id: `event-${Date.now()}`,
        name: 'New Event',
        isActive: false,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        theme: {
            primaryColor: '#1a1a2e',
            accentColor: '#c9a962',
            bannerBg: 'linear-gradient(135deg, #1a1a2e 0%, #c9a962 100%)',
        },
        banner: {
            text: '🎉 Special Offer!',
            link: '/collection/all',
            dismissible: true,
        },
        discountPercent: 10,
        heroOverride: {
            headline: '',
            tagline: '',
        },
    });

    const saveEvent = async (event: Event) => {
        if (!eventConfig) return;
        const existingIndex = eventConfig.events.findIndex(e => e.id === event.id);
        let updated: EventConfig;

        if (existingIndex >= 0) {
            updated = {
                ...eventConfig,
                events: eventConfig.events.map(e => e.id === event.id ? event : e),
            };
        } else {
            updated = {
                ...eventConfig,
                events: [...eventConfig.events, event],
            };
        }

        await saveEvents(updated);
        setEditingEvent(null);
        setIsCreating(false);
    };

    // PIN Entry Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-brand-primary">Admin Access</h1>
                        <p className="text-gray-500 text-sm mt-1">Enter PIN to continue</p>
                    </div>

                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="Enter PIN"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            autoFocus
                        />
                        {pinError && (
                            <p className="text-red-500 text-sm text-center mt-2">{pinError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 py-3 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 transition-colors"
                        >
                            Unlock
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-brand-primary animate-pulse">Loading events...</div>
            </div>
        );
    }

    // Event Editor Modal
    const EventEditor = ({ event, onSave, onCancel }: { event: Event; onSave: (e: Event) => void; onCancel: () => void }) => {
        const [formData, setFormData] = useState<Event>(event);

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                        <h2 className="text-xl font-bold text-brand-primary">
                            {isCreating ? 'Create Event' : 'Edit Event'}
                        </h2>
                        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>

                        {/* Theme Colors */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Theme Colors</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Primary Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.theme.primaryColor}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                theme: { ...formData.theme, primaryColor: e.target.value }
                                            })}
                                            className="w-12 h-10 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.theme.primaryColor}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                theme: { ...formData.theme, primaryColor: e.target.value }
                                            })}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Accent Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.theme.accentColor}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                theme: { ...formData.theme, accentColor: e.target.value }
                                            })}
                                            className="w-12 h-10 rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.theme.accentColor}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                theme: { ...formData.theme, accentColor: e.target.value }
                                            })}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Preview */}
                            <div
                                className="mt-4 p-4 rounded-lg text-white text-center"
                                style={{
                                    background: `linear-gradient(135deg, ${formData.theme.primaryColor} 0%, ${formData.theme.accentColor} 100%)`
                                }}
                            >
                                Theme Preview
                            </div>
                        </div>

                        {/* Banner */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Banner</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Banner Text</label>
                                    <input
                                        type="text"
                                        value={formData.banner.text}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            banner: { ...formData.banner, text: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="💝 Valentine's Special - 15% Off!"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Banner Link</label>
                                    <input
                                        type="text"
                                        value={formData.banner.link || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            banner: { ...formData.banner, link: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="/collection/all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                                    className="flex-1"
                                />
                                <span className="text-2xl font-bold text-brand-accent w-16 text-right">
                                    {formData.discountPercent}%
                                </span>
                            </div>
                        </div>

                        {/* Hero Override */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Hero Override (Optional)</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={formData.heroOverride?.headline || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            heroOverride: { ...formData.heroOverride, headline: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Share Love with Our Gift Hampers"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tagline</label>
                                    <input
                                        type="text"
                                        value={formData.heroOverride?.tagline || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            heroOverride: { ...formData.heroOverride, tagline: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Make this Valentine's unforgettable"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Event
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Admin Dashboard
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-primary">Event Manager</h1>
                    <div className="flex items-center gap-4">
                        {saveStatus === 'saving' && (
                            <span className="text-sm text-gray-500 animate-pulse">Saving...</span>
                        )}
                        {saveStatus === 'saved' && (
                            <span className="text-sm text-green-600">✓ Saved</span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Create Button */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-700">All Events</h2>
                    <button
                        onClick={() => {
                            setEditingEvent(createNewEvent());
                            setIsCreating(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Event
                    </button>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {eventConfig?.events.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No events yet. Create your first event!</p>
                        </div>
                    ) : (
                        eventConfig?.events.map((event) => {
                            const isLive = (() => {
                                const now = new Date();
                                const start = new Date(event.startDate);
                                const end = new Date(event.endDate);
                                end.setHours(23, 59, 59, 999);
                                return event.isActive && now >= start && now <= end;
                            })();

                            return (
                                <div
                                    key={event.id}
                                    className={`bg-white rounded-lg shadow-sm border-l-4 ${isLive ? 'border-green-500' : event.isActive ? 'border-yellow-500' : 'border-gray-300'
                                        }`}
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-brand-primary">
                                                        {event.name}
                                                    </h3>
                                                    {isLive && (
                                                        <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full animate-pulse">
                                                            LIVE
                                                        </span>
                                                    )}
                                                    {event.isActive && !isLive && (
                                                        <span className="px-2 py-0.5 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">
                                                            SCHEDULED
                                                        </span>
                                                    )}
                                                    {!event.isActive && (
                                                        <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">
                                                            INACTIVE
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {event.startDate} → {event.endDate}
                                                    </span>
                                                    <span className="font-medium text-brand-accent">
                                                        {event.discountPercent}% off
                                                    </span>
                                                </div>
                                                <div
                                                    className="inline-block px-4 py-2 rounded-lg text-white text-sm"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${event.theme.primaryColor} 0%, ${event.theme.accentColor} 100%)`
                                                    }}
                                                >
                                                    {event.banner.text}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleEventActive(event.id)}
                                                    className={`p-2 rounded-lg transition-colors ${event.isActive
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                    title={event.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingEvent(event);
                                                        setIsCreating(false);
                                                    }}
                                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteEvent(event.id)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Event Editor Modal */}
            {editingEvent && (
                <EventEditor
                    event={editingEvent}
                    onSave={saveEvent}
                    onCancel={() => {
                        setEditingEvent(null);
                        setIsCreating(false);
                    }}
                />
            )}
        </div>
    );
}

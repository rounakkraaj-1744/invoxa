"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    Plus,
    Search,
    Mail,
    Phone,
    MapPin,
    MoreHorizontal,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useBusiness } from "@/context/BusinessContext";

interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    address?: string | null;
    taxId?: string | null;
}

import { CreateClientModal } from "@/components/dashboard/CreateClientModal";

export default function ClientsPage() {
    const { activeBusiness } = useBusiness();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchClients = async () => {
        if (!activeBusiness) return;
        setIsLoading(true);
        try {
            const data = await api.get<Client[]>("/v1/clients", {
                params: searchQuery ? { search: searchQuery } : undefined
            });
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm("Are you sure you want to delete this client?")) return;
        try {
            await api.delete(`/v1/clients/${id}`);
            fetchClients();
        } catch (error) {
            console.error("Failed to delete client:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchClients();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [activeBusiness, searchQuery]);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader title="Clients" />

            <main className="flex-1 p-8 space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Clients</h1>
                        <p className="text-sm text-text-tertiary">Manage your client relationships.</p>
                    </div>
                    <Button
                        disabled={!activeBusiness}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-accent text-black hover:bg-accent/90 gap-2 h-11 px-6 shadow-glow font-bold text-xs uppercase tracking-widest"
                    >
                        <Plus size={18} />
                        <span>Add Client</span>
                    </Button>
                </div>

                <CreateClientModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={fetchClients}
                />

                {/* Search Bar Area */}
                <div className="bg-surface/30 border border-border-default rounded-xl p-4">
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border-default/50 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                    </div>
                </div>

                {/* Clients Grid */}
                {!activeBusiness ? (
                    <Card className="bg-surface/30 border-border-default p-12 text-center">
                        <p className="text-text-tertiary">Please select or create a business to view clients.</p>
                    </Card>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-surface/20 rounded-xl border border-border-default" />
                        ))}
                    </div>
                ) : clients.length === 0 ? (
                    <Card className="bg-surface/30 border-border-default p-12 text-center">
                        <p className="text-text-tertiary">No clients found. Click "Add Client" to get started.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map((client, i) => (
                            <Card key={client.id} className="bg-surface/30 border-border-default hover:border-border-active transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold border-2",
                                                i % 3 === 0 ? "bg-accent/10 border-accent/20 text-accent" :
                                                    i % 3 === 1 ? "bg-info/10 border-info/20 text-info" :
                                                        "bg-success/10 border-success/20 text-success"
                                            )}>
                                                {getInitials(client.name)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-tight uppercase tracking-tight">{client.name}</h3>
                                                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mt-1">
                                                    {client.company || "Individual"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDeleteClient(client.id)}
                                                className="p-2 text-text-tertiary hover:text-error transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button className="p-2 text-text-tertiary hover:text-white transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail size={14} className="text-text-tertiary shrink-0" />
                                            <span className="text-text-secondary truncate">{client.email}</span>
                                        </div>
                                        {client.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone size={14} className="text-text-tertiary shrink-0" />
                                                <span className="text-text-secondary">{client.phone}</span>
                                            </div>
                                        )}
                                        {client.address && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <MapPin size={14} className="text-text-tertiary shrink-0" />
                                                <span className="text-text-secondary text-xs truncate">{client.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-between pt-4 border-t border-border-default/50">
                                        <div>
                                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Account Holder</p>
                                            <p className="text-sm font-bold text-white truncate max-w-[150px]">{client.name}</p>
                                        </div>
                                        <Badge variant="paid" className="px-3 py-1">Active</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Check, ChevronsUpDown, Plus, Search, User as UserIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CreateClientModal } from "./CreateClientModal";

import { useBusiness } from "@/context/BusinessContext";

export interface Client {
    id: string;
    name: string;
    email: string;
    company?: string | null;
}

interface ClientSelectorProps {
    value?: string;
    onChange: (clientId: string) => void;
    onClientData?: (client: Client) => void;
}

export function ClientSelector({ value, onChange, onClientData }: ClientSelectorProps) {
    const { activeBusiness } = useBusiness();
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchClients = async () => {
        if (!activeBusiness) return;
        setIsLoading(true);
        try {
            const data = await api.get<Client[]>("/v1/clients", {
                params: searchQuery ? { search: searchQuery } : undefined,
                headers: { 'x-business-id': activeBusiness.id }
            });
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchClients();
        }
    }, [open, searchQuery]);

    const selectedClient = clients.find((client) => client.id === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2 bg-surface/30 border border-border-default rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all h-11"
            >
                <div className="flex items-center gap-3">
                    <UserIcon size={16} className="text-text-tertiary" />
                    <span className={cn(selectedClient ? "text-white font-medium" : "text-text-tertiary")}>
                        {selectedClient ? selectedClient.name : "Select a client..."}
                    </span>
                </div>
                <ChevronsUpDown size={16} className="text-text-tertiary" />
            </button>

            {open && (
                <div className="absolute z-[100] w-full mt-2 bg-elevated border border-border-default rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-border-default">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            <input
                                autoFocus
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-background border border-border-default/50 rounded-md pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1">
                        {isLoading && clients.length === 0 ? (
                            <div className="p-4 text-center">
                                <Loader2 size={16} className="animate-spin text-accent mx-auto" />
                            </div>
                        ) : clients.length === 0 ? (
                            <div className="p-4 text-center text-xs text-text-tertiary">
                                No clients found.
                            </div>
                        ) : (
                            clients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => {
                                        onChange(client.id);
                                        onClientData?.(client);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs transition-colors",
                                        client.id === value ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-surface hover:text-white"
                                    )}
                                >
                                    <div>
                                        <p className="font-bold">{client.name}</p>
                                        <p className="text-[10px] text-text-tertiary">{client.email}</p>
                                    </div>
                                    {client.id === value && <Check size={14} />}
                                </button>
                            ))
                        )}
                    </div>

                    <div className="p-1 border-t border-border-default">
                        <button
                            onClick={() => {
                                setOpen(false);
                                setIsCreateModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-accent hover:bg-accent/10 transition-colors font-bold uppercase tracking-widest"
                        >
                            <Plus size={14} />
                            <span>Add New Client</span>
                        </button>
                    </div>
                </div>
            )}

            <CreateClientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchClients();
                    setOpen(true);
                }}
            />

            {/* Backdrop to close when clicking outside */}
            {open && (
                <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
}

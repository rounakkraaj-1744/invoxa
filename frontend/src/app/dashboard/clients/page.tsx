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
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const clients = [
    {
        name: "Acme Corp",
        contact: "Alice Smith",
        email: "alice@acme.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Blvd, SF",
        totalBilled: "$45,200",
        status: "active" as const,
        initials: "AC"
    },
    {
        name: "Globex Inc",
        contact: "Bob Jones",
        email: "bob@globex.com",
        phone: "+1 (555) 987-6543",
        address: "456 Innovation Dr, NY",
        totalBilled: "$12,500",
        status: "active" as const,
        initials: "GL"
    },
    {
        name: "Soylent Corp",
        contact: "Charlie Brown",
        email: "charlie@soylent.com",
        phone: "+1 (555) 456-7890",
        address: "789 Future Way, TX",
        totalBilled: "$8,900",
        status: "inactive" as const,
        initials: "SO"
    },
    {
        name: "Initech",
        contact: "Peter Gibbons",
        email: "peter@initech.com",
        phone: "+1 (555) 111-2222",
        address: "101 Boring Ln, WA",
        totalBilled: "$3,200",
        status: "active" as const,
        initials: "IN"
    },
    {
        name: "Umbrella Corp",
        contact: "Albert Wesker",
        email: "albert@umbrella.com",
        phone: "+1 (555) 666-7777",
        address: "666 Raccoon City, CO",
        totalBilled: "$150,000",
        status: "active" as const,
        initials: "UM"
    },
    {
        name: "Stark Industries",
        contact: "Tony Stark",
        email: "tony@stark.com",
        phone: "+1 (555) 999-8888",
        address: "10880 Malibu Point, CA",
        totalBilled: "$1,200,000",
        status: "active" as const,
        initials: "ST"
    }
];

export default function ClientsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader title="Clients" />

            <main className="flex-1 p-8 space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Clients</h1>
                        <p className="text-sm text-text-tertiary">Manage your client relationships.</p>
                    </div>
                    <Button className="bg-accent text-black hover:bg-accent/90 gap-2 h-11 px-6 shadow-glow font-bold text-xs uppercase tracking-widest">
                        <Plus size={18} />
                        <span>Add Client</span>
                    </Button>
                </div>

                {/* Search Bar Area */}
                <div className="bg-surface/30 border border-border-default rounded-xl p-4">
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            placeholder="Search clients..."
                            className="w-full bg-background border border-border-default/50 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                    </div>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client, i) => (
                        <Card key={i} className="bg-surface/30 border-border-default hover:border-border-active transition-all group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold border-2",
                                            i % 3 === 0 ? "bg-accent/10 border-accent/20 text-accent" :
                                                i % 3 === 1 ? "bg-info/10 border-info/20 text-info" :
                                                    "bg-success/10 border-success/20 text-success"
                                        )}>
                                            {client.initials}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg leading-tight">{client.name}</h3>
                                            <p className="text-xs text-text-tertiary">{client.contact}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-text-tertiary hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail size={14} className="text-text-tertiary shrink-0" />
                                        <span className="text-text-secondary truncate">{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone size={14} className="text-text-tertiary shrink-0" />
                                        <span className="text-text-secondary">{client.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin size={14} className="text-text-tertiary shrink-0" />
                                        <span className="text-text-secondary text-xs truncate">{client.address}</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between pt-4 border-t border-border-default/50">
                                    <div>
                                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Total Billed</p>
                                        <p className="text-xl font-bold font-mono text-white tracking-tighter">{client.totalBilled}</p>
                                    </div>
                                    <Badge variant={client.status === 'active' ? 'paid' : 'draft'} className="px-3 py-1">
                                        {client.status === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}

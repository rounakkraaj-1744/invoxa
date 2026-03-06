"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    FileText,
    Users,
    RefreshCcw,
    CreditCard,
    BarChart3,
    Key,
    Settings,
    ChevronLeft,
    ChevronRight,
    Plus
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";

const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Invoices", icon: FileText, href: "/dashboard/invoices" },
    { name: "Clients", icon: Users, href: "/dashboard/clients" },
    { name: "Recurring", icon: RefreshCcw, href: "/dashboard/recurring" },
    { name: "Payments", icon: CreditCard, href: "/dashboard/payments" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "API Keys", icon: Key, href: "/dashboard/api-keys", badge: "dev" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

import { BusinessSwitcher } from "./BusinessSwitcher";

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { data: session } = authClient.useSession();

    return (
        <aside
            className={cn(
                "h-screen bg-surface border-r border-border-default transition-all duration-300 flex flex-col sticky top-0 z-[99]",
                isCollapsed ? "w-[80px]" : "w-[240px]"
            )}
        >
            <div className="p-4 flex items-center justify-between mb-2">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-black text-xl">I</div>
                        <span className="text-xl font-bold tracking-tight text-white">Invoxa</span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 hover:bg-elevated rounded-md border border-border-default text-text-tertiary hover:text-white transition-all ml-auto"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <BusinessSwitcher isCollapsed={isCollapsed} />

            <div className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group relative",
                                isActive
                                    ? "bg-accent/10 text-accent font-medium border-l-2 border-accent"
                                    : "text-text-secondary hover:bg-elevated hover:text-foreground"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-accent" : "text-text-secondary group-hover:text-foreground")} />
                            {!isCollapsed && <span className="text-sm">{item.name}</span>}
                            {!isCollapsed && item.badge && (
                                <span className="ml-auto text-[10px] bg-info/10 text-info border border-info/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                    {item.badge}
                                </span>
                            )}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-elevated border border-border-default rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border-default space-y-4">
                {!isCollapsed && (
                    <Link href="/dashboard/invoices/new" className="w-full">
                        <Button variant="primary" className="w-full gap-2 py-5 shadow-glow">
                            <Plus size={16} />
                            <span>New Invoice</span>
                        </Button>
                    </Link>
                )}
                <div className={cn("flex items-center gap-3 p-1 rounded-lg", !isCollapsed && "hover:bg-elevated transition-colors")}>
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name ?? ""}
                            className="w-10 h-10 rounded-full border border-accent/20 object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center text-accent font-bold">
                            {session?.user?.name?.[0] || "U"}
                        </div>
                    )}
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">{session?.user?.name || "User"}</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                <p className="text-[10px] text-accent uppercase font-bold tracking-wider">Pro Plan</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

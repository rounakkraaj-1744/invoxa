import { Search, Bell, Command } from "lucide-react";
import Link from "next/link";

export function DashboardHeader({ title }: { title: string }) {
    return (
        <header className="h-14 border-b border-border-default bg-background/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold">{title}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="bg-surface border border-border-default rounded-md pl-10 pr-12 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-elevated border border-border-default text-text-tertiary">
                        <Command size={10} /> K
                    </div>
                </div>

                <button className="relative text-text-secondary hover:text-foreground transition-colors p-2 hover:bg-elevated rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
                </button>

                <div className="h-8 w-px bg-border-default" />

                <Link href="/dashboard/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-accent text-[10px] text-background flex items-center justify-center font-bold">RK</div>
                </Link>
            </div>
        </header>
    );
}

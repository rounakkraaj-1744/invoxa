"use client";

import { useBusiness } from "@/context/BusinessContext";
import { cn } from "@/lib/utils";
import { ChevronRight, Plus, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CreateBusinessModal } from "./CreateBusinessModal";

export function BusinessSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
    const { activeBusiness, businesses, setActiveBusiness, isLoading, refreshBusinesses } = useBusiness();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-open modal if no businesses exist
        if (!activeBusiness && businesses.length === 0 && !isLoading) {
            setIsModalOpen(true);
        }
    }, [activeBusiness, businesses, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isCollapsed) return null;

    return (
        <div className="px-4 mb-6 relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2.5 bg-background border border-border-default rounded-xl hover:border-border-active transition-all cursor-pointer group select-none",
                    isOpen && "border-accent ring-2 ring-accent/20"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                        {activeBusiness ? activeBusiness.name[0] : '?'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate leading-none">
                            {activeBusiness ? activeBusiness.name : 'No Business'}
                        </p>
                        <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1">Active Space</p>
                    </div>
                    <ChevronRight size={14} className={cn("text-text-tertiary transition-transform", isOpen ? "rotate-90 text-white" : "group-hover:text-white")} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-4 right-4 top-full mt-2 bg-elevated border border-border-default rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[250px] overflow-y-auto py-2">
                        <p className="px-4 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Select Business</p>
                        {businesses.map((business) => (
                            <div
                                key={business.id}
                                onClick={() => {
                                    setActiveBusiness(business);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-3 flex items-center justify-between hover:bg-surface cursor-pointer transition-colors group",
                                    activeBusiness?.id === business.id && "bg-surface/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">
                                        {business.name[0]}
                                    </div>
                                    <p className="text-sm text-foreground font-medium truncate max-w-[120px]">
                                        {business.name}
                                    </p>
                                </div>
                                {activeBusiness?.id === business.id && (
                                    <Check size={14} className="text-accent" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t border-border-default bg-surface/30">
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsOpen(false);
                            }}
                            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                            <span>Add Business</span>
                        </button>
                    </div>
                </div>
            )}

            <CreateBusinessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refreshBusinesses}
            />
        </div>
    );
}

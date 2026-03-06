"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, FileText, Send, Download, Trash2, Edit, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface ActionsDropdownProps {
    invoiceId: string;
    onAction?: (action: string) => void;
    align?: "left" | "right";
}

export const ActionsDropdown = ({ invoiceId, onAction, align = "right" }: ActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPerformingAction, setIsPerformingAction] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const actions = [
        { label: "View Details", icon: FileText, value: "view" },
        { label: "Edit Invoice", icon: Edit, value: "edit" },
        { label: "Send to Client", icon: Send, value: "send" },
        { label: "Download PDF", icon: Download, value: "download" },
        { label: "Mark as Paid", icon: CheckCircle2, value: "mark-paid", className: "text-success" },
        { label: "Cancel Invoice", icon: XCircle, value: "cancel", className: "text-text-tertiary" },
        { label: "Delete", icon: Trash2, value: "delete", className: "text-error" },
    ];

    const handleAction = async (value: string) => {
        if (value === "view") {
            router.push(`/dashboard/invoices/${invoiceId}`);
            setIsOpen(false);
            return;
        }

        if (value === "edit") {
            // Edit logic - maybe redirect to a specific edit route or builder with ID
            router.push(`/dashboard/invoices/new?id=${invoiceId}`);
            setIsOpen(false);
            return;
        }

        setIsPerformingAction(true);
        try {
            if (value === "send") {
                await api.post(`/v1/invoices/${invoiceId}/send`, {});
            } else if (value === "mark-paid") {
                await api.post(`/v1/invoices/${invoiceId}/paid`, {});
            } else if (value === "cancel") {
                await api.post(`/v1/invoices/${invoiceId}/cancel`, {});
            } else if (value === "delete") {
                if (confirm("Are you sure you want to delete this invoice?")) {
                    await api.delete(`/v1/invoices/${invoiceId}`);
                } else {
                    setIsPerformingAction(false);
                    return;
                }
            } else if (value === "download") {
                const data = await api.get<{ url: string }>(`/v1/invoices/${invoiceId}/pdf`);
                window.open(data.url, '_blank');
            }

            onAction?.("refresh");
        } catch (error) {
            console.error(`Failed to perform action ${value}:`, error);
            alert(`Error: Could not ${value} invoice.`);
        } finally {
            setIsPerformingAction(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !isPerformingAction && setIsOpen(!isOpen)}
                className={cn(
                    "p-2 hover:text-white text-text-tertiary transition-all hover:bg-surface/10 rounded-lg",
                    isPerformingAction && "opacity-50 cursor-not-allowed"
                )}
                disabled={isPerformingAction}
            >
                {isPerformingAction ? <Loader2 size={16} className="animate-spin text-accent" /> : <MoreHorizontal size={18} />}
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute z-[100] mt-2 w-52 bg-elevated border border-border-default rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150",
                        align === "right" ? "right-0" : "left-0"
                    )}
                >
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => handleAction(action.value)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold text-text-secondary hover:text-white hover:bg-white/5 transition-all text-left uppercase tracking-widest",
                                action.className
                            )}
                        >
                            <action.icon size={14} className="opacity-70" />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

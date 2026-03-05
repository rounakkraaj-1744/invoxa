"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, FileText, Send, Download, Trash2, Edit, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionsDropdownProps {
    invoiceId: string;
    onAction?: (action: string) => void;
    align?: "left" | "right";
}

export const ActionsDropdown = ({ invoiceId, onAction, align = "right" }: ActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        { label: "Delete", icon: Trash2, value: "delete", className: "text-error" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 hover:text-white text-text-tertiary transition-colors"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute z-[100] mt-2 w-48 bg-surface border border-border-default rounded-lg shadow-2xl py-1 overflow-hidden",
                        align === "right" ? "right-0" : "left-0"
                    )}
                >
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                onAction?.(action.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-white hover:bg-white/5 transition-colors",
                                action.className
                            )}
                        >
                            <action.icon size={14} />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

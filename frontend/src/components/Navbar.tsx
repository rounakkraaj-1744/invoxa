"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-background/80 backdrop-blur-xl border-border-default py-3 shadow-lg"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-sm rotate-45 flex items-center justify-center">
                        <div className="w-4 h-4 bg-background rounded-sm -rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Invoxa</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {["Features", "Pricing", "API", "Docs", "Changelog"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                        Sign In
                    </Button>
                    <Button size="sm">Start Free</Button>
                </div>
            </div>
        </nav>
    );
}

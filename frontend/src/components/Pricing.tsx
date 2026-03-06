import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
    {
        name: "Free",
        price: "$0",
        description: "For individuals just getting started.",
        features: ["5 Invoices / month", "Standard Templates", "Client Management", "Community Support"],
        buttonText: "Start Free",
        buttonVariant: "ghost" as const,
    },
    {
        name: "Pro",
        price: "$12",
        description: "For growing freelancers and studios.",
        features: ["Unlimited Invoices", "Custom Branding", "Recurring Invoices", "API Access (Basic)", "Priority Support"],
        buttonText: "Go Pro",
        buttonVariant: "primary" as const,
        popular: true,
    },
    {
        name: "Business",
        price: "$39",
        description: "For teams requiring advanced features.",
        features: ["Multiple Team Members", "Advanced Analytics", "White-label Portal", "Full API Access", "Account Manager"],
        buttonText: "Choose Business",
        buttonVariant: "ghost" as const,
    },
    {
        name: "Developer",
        price: "Custom",
        description: "For high-volume API integration.",
        features: ["Usage-based Pricing", "Webhooks", "Custom Endpoints", "SDK Support", "Technical Onboarding"],
        buttonText: "Contact Sales",
        buttonVariant: "ghost" as const,
    },
];

import { useRouter } from "next/navigation";

export function Pricing() {
    const router = useRouter();

    return (
        <section id="pricing" className="py-24 bg-surface/10">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, honest pricing</h2>
                    <p className="text-text-secondary">Choose the plan that fits your current scale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-8 bg-surface border border-border-default flex flex-col transition-all relative",
                                tier.popular && "border-accent shadow-[0_0_24px_rgba(245,158,11,0.15)] ring-1 ring-accent/40"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.price !== "Custom" && <span className="text-text-tertiary text-sm">/mo</span>}
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">{tier.description}</p>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                                        <Check size={14} className="text-accent shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={tier.buttonVariant}
                                className="w-full"
                                onClick={() => router.push("/signup")}
                            >
                                {tier.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

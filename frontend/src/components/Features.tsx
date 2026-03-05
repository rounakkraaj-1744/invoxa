import { LucideIcon, Zap, Repeat, Bell, Globe, Plug, BarChart3, Palette, Users, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
}

const features: Feature[] = [
    { title: "Instant PDF Generation", description: "Generate pixel-perfect invoices in milliseconds with our high-speed engine.", icon: Zap },
    { title: "Recurring Invoices", description: "Set it and forget it. Automate your monthly billing with smart recurring schedules.", icon: Repeat },
    { title: "Auto Payment Reminders", description: "Get paid faster with automated follow-ups for overdue or pending invoices.", icon: Bell },
    { title: "Multi-Currency & Tax", description: "Global scale support with automatic tax calculation and 150+ currencies.", icon: Globe },
    { title: "REST API Access", description: "First-class developer experience with a robust API for programatic control.", icon: Plug },
    { title: "Revenue Analytics", description: "Track your growth with beautiful, real-time dashboards and financial reports.", icon: BarChart3 },
    { title: "Custom Branding", description: "Your brand, front and center. Personalize every invoice with logos and colors.", icon: Palette },
    { title: "Client Management", description: "Keep all your client data, history, and communication in one secure place.", icon: Users },
    { title: "Secure Payments", description: "Integrated with Stripe and PayPal for seamless, secure transaction processing.", icon: Lock },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-background relative">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-medium text-accent mb-4 tracking-widest uppercase">Everything you need</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Nothing you don't</h3>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Powerful features designed for modern teams, without the bloat of traditional accounting software.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-surface/50 border-border-default hover:border-border-active transition-all group">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon size={20} />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                <CardDescription className="text-text-secondary leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

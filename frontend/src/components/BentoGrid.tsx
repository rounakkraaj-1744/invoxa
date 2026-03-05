import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

export function BentoGrid() {
    return (
        <section className="py-24 bg-surface/30">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Built for how modern teams work</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Seamlessly integrated workflows that save you hours every week.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto lg:h-[600px]">
                    {/* Large Card 1: Animated Invoice Preview */}
                    <Card className="md:col-span-3 md:row-span-2 relative overflow-hidden group">
                        <div className="p-8 h-full flex flex-col">
                            <Badge variant="accent" className="mb-4 w-fit">Visual Builder</Badge>
                            <h4 className="text-2xl font-bold mb-4">Intelligent Invoice Preview</h4>
                            <p className="text-text-secondary mb-8">What you see is exactly what your client gets. No surprises, just professional invoices.</p>

                            <div className="flex-1 bg-surface rounded-lg border border-border-default p-6 shadow-inner relative overflow-hidden">
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-border-default pb-4">
                                        <div className="w-24 h-4 bg-border-active/20 rounded" />
                                        <div className="w-24 h-4 bg-border-active/20 rounded" />
                                    </div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex justify-between items-center py-2 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                                            <div className="flex gap-4 items-center">
                                                <div className="w-8 h-8 bg-border-active/10 rounded-full" />
                                                <div className="w-32 h-3 bg-border-active/20 rounded" />
                                            </div>
                                            <div className="w-16 h-3 bg-border-active/20 rounded" />
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
                            </div>
                        </div>
                    </Card>

                    {/* Large Card 2: API Snippet */}
                    <Card className="md:col-span-3 bg-[#0D0D0F] border-border-default relative group overflow-hidden">
                        <div className="p-8 h-full flex flex-col">
                            <Badge className="bg-info/10 text-info border-info/20 mb-4 w-fit">Developer-First</Badge>
                            <h4 className="text-2xl font-bold mb-4">Powerful API Integration</h4>
                            <div className="flex-1 bg-black/50 rounded-lg p-4 font-mono text-sm overflow-hidden border border-white/5">
                                <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                                <div className="text-blue-400">POST <span className="text-white">/v1/invoices</span></div>
                                <div className="text-gray-500">{"{"}</div>
                                <div className="pl-4">
                                    <span className="text-purple-400">"client"</span>: <span className="text-green-400">"Acme Corp"</span>,
                                </div>
                                <div className="pl-4">
                                    <span className="text-purple-400">"items"</span>: [{"{"} <span className="text-purple-400">"rate"</span>: <span className="text-yellow-400">2500</span> {"}"}]
                                </div>
                                <div className="text-gray-500">{"}"}</div>
                            </div>
                        </div>
                    </Card>

                    {/* Small Cards */}
                    <Card className="md:col-span-1 bg-surface group hover:border-accent/30 transition-all">
                        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                            <div className="text-2xl mb-2">🌍</div>
                            <span className="text-sm font-bold">150+ Currencies</span>
                        </div>
                    </Card>
                    <Card className="md:col-span-2 bg-surface group">
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-bold text-text-secondary uppercase">Revenue Analytics</span>
                                <BarChart3Icon size={16} className="text-accent" />
                            </div>
                            <div className="flex-1 flex items-end gap-1">
                                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="flex-1 bg-accent/20 rounded-t-sm group-hover:bg-accent/40 transition-all" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

function BarChart3Icon({ size, className }: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
        </svg>
    );
}

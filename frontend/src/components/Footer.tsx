import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-16 bg-background border-t border-border-default">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-accent rounded-sm rotate-45 flex items-center justify-center">
                                <div className="w-3 h-3 bg-background rounded-sm -rotate-45" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-foreground">Invoxa</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                            Building the future of finance for freelancers, studios, and modern developers.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest">Product</h4>
                        <ul className="space-y-4">
                            {["Features", "Pricing", "Enterprise", "Changelog"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest">Developers</h4>
                        <ul className="space-y-4">
                            {["API Documentation", "SDKs", "Webhooks", "Status"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-4">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-text-secondary hover:text-foreground transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-default/50 gap-4">
                    <p className="text-xs text-text-tertiary">
                        © {new Date().getFullYear()} Invoxa Technologies Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {["Twitter", "GitHub", "LinkedIn"].map(social => (
                            <Link key={social} href="#" className="text-xs text-text-tertiary hover:text-foreground transition-colors">
                                {social}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

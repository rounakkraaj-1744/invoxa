import { Button } from "@/components/ui/Button";

export function APIShowcase() {
    return (
        <section className="py-24 bg-background border-y border-border-default h-[600px] flex items-center">
            <div className="container px-6 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Invoice generation via API — one call, done.</h2>
                    <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                        Integrate Invoxa directly into your application. Generate PDFs, send emails, and track status programmatically with our simple REST API.
                    </p>
                    <Button size="lg" className="px-8">
                        Get your API key →
                    </Button>
                </div>

                <div className="bg-surface rounded-lg border border-border-active shadow-2xl p-1 overflow-hidden">
                    <div className="bg-black/50 rounded-md p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                            <span className="text-success font-bold">POST</span>
                            <span className="text-text-secondary">/v1/invoices</span>
                        </div>
                        <pre className="text-sky-400">
                            {`{
  "client": "Acme Corp",
  "items": [
    { 
      "name": "Design work", 
      "qty": 1, 
      "rate": 2500 
    }
  ],
  "currency": "USD",
  "due_date": "2026-04-01"
}`}
                        </pre>
                    </div>

                    <div className="bg-accent/5 p-4 border-t border-border-default flex items-center justify-between">
                        <span className="text-xs text-text-tertiary">Response Body</span>
                        <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded">201 Created</span>
                    </div>
                    <div className="p-4 bg-surface font-mono text-xs text-text-secondary overflow-hidden h-24">
                        {`{ "id": "inv_12345", "url": "https://invoxa.io/pdf/..." }`}
                    </div>
                </div>
            </div>
        </section>
    );
}

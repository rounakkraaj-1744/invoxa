"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { useBusiness } from "@/context/BusinessContext";

const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    company: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export function CreateClientModal({
    isOpen,
    onClose,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { activeBusiness } = useBusiness();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ClientForm>({
        resolver: zodResolver(clientSchema),
    });

    const onSubmit = async (data: ClientForm) => {
        if (!activeBusiness) {
            console.error("No active business selected");
            return;
        }

        try {
            await api.post("/v1/clients", data, {
                headers: {
                    'x-business-id': activeBusiness.id
                }
            });
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create client:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-surface border border-border-default rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border-default flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Add New Client</h2>
                        <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1">Client Information</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-tertiary hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Full Name</label>
                        <input
                            {...register("name")}
                            placeholder="John Doe"
                            className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                        {errors.name && <p className="text-error text-[10px] font-bold pl-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Email Address</label>
                        <input
                            {...register("email")}
                            placeholder="john@example.com"
                            className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                        {errors.email && <p className="text-error text-[10px] font-bold pl-1">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Company (Opt)</label>
                            <input
                                {...register("company")}
                                placeholder="Acme Inc"
                                className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Phone (Opt)</label>
                            <input
                                {...register("phone")}
                                placeholder="+1..."
                                className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Address (Opt)</label>
                        <textarea
                            {...register("address")}
                            placeholder="Full address..."
                            rows={2}
                            className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 shadow-glow" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Client"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

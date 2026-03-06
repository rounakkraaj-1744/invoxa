"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { api } from "@/lib/api";

const businessSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid business email"),
    currency: z.string().default("USD"),
});

type BusinessForm = z.infer<typeof businessSchema>;

export function CreateBusinessModal({
    isOpen,
    onClose,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BusinessForm>({
        //@ts-ignore
        resolver: zodResolver(businessSchema),
    });

    const onSubmit = async (data: BusinessForm) => {
        try {
            await api.post("/v1/business", data);
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create business:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
            <div className="bg-surface border border-border-default rounded-2xl w-full max-w-md relative z-100 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border-default flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Create Business</h2>
                        <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1">Set up your workspace</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-tertiary hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* @ts-ignore */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Business Name</label>
                        <input
                            {...register("name")}
                            placeholder="My Agency"
                            className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                        {errors.name && <p className="text-error text-[10px] font-bold pl-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Business Email</label>
                        <input
                            {...register("email")}
                            placeholder="billing@myagency.com"
                            className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                        {errors.email && <p className="text-error text-[10px] font-bold pl-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest pl-1">Currency</label>
                        <select
                            {...register("currency")}
                            className="w-full bg-background border border-border-default rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 shadow-glow" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Workspace"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

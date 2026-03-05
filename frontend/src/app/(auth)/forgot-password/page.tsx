"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function ForgotPassword() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
            <Link href="/" className="flex items-center gap-2 mb-12">
                <div className="w-8 h-8 bg-accent rounded-sm rotate-45 flex items-center justify-center">
                    <div className="w-4 h-4 bg-background rounded-sm -rotate-45" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-foreground">Invoxa</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-surface border border-border-default p-10 rounded-xl"
            >
                <h2 className="text-2xl font-bold mb-2">Reset password</h2>
                <p className="text-text-secondary mb-8">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                        <Input type="email" placeholder="john@example.com" />
                    </div>

                    <Button className="w-full py-6 text-base">
                        Send reset link
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-text-secondary">
                    <Link href="/login" className="text-accent hover:underline font-medium">Return to sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}

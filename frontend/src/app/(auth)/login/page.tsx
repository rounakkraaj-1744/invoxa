"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const handleEmailSignIn = async (data: LoginForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const { error: signInError } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: "/dashboard"
            });

            if (signInError) {
                setError(signInError.message || "Invalid credentials");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard"
            });
        } catch (err) {
            setError("Failed to sign in with Google");
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left side: branding - reusable from signup or shared */}
            <div className="hidden lg:flex flex-1 relative bg-surface overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                </div>
                <div className="absolute inset-0 radial-glow opacity-50" />

                <div className="relative z-10 w-full flex flex-col justify-center px-16">
                    <Link href="/" className="flex items-center gap-2 mb-16">
                        <div className="w-8 h-8 bg-accent rounded-sm rotate-45 flex items-center justify-center">
                            <div className="w-4 h-4 bg-background rounded-sm -rotate-45" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-foreground">Invoxa</span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                        Welcome back <br />
                        <span className="font-display italic font-normal text-accent">to Invoxa.</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-md">
                        The professional way to manage your invoices and clients in one place.
                    </p>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-10 lg:hidden flex justify-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-sm rotate-45 flex items-center justify-center">
                                <div className="w-4 h-4 bg-background rounded-sm -rotate-45" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">Invoxa</span>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold mb-2 text-white">Sign into your account</h2>
                        <p className="text-text-secondary mb-8">Enter your credentials to access your dashboard.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit(handleEmailSignIn)}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Email Address</label>
                                <Input disabled={isLoading} type="email" {...register("email")} placeholder="john@example.com" />
                                {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-accent hover:underline font-bold">Forgot password?</Link>
                                </div>
                                <Input disabled={isLoading} type="password" {...register("password")} placeholder="••••••••" />
                                {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input disabled={isLoading} type="checkbox" id="remember" className="w-4 h-4 rounded border-border-default bg-surface text-accent focus:ring-accent" />
                                <label htmlFor="remember" className="text-sm text-text-tertiary font-medium">Remember me for 30 days</label>
                            </div>

                            <Button disabled={isLoading} className="w-full mt-2 py-6 text-sm font-bold uppercase tracking-widest shadow-glow">
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-default" /></div>
                                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-background px-4 text-text-tertiary">Or continue with</span></div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                disabled={isLoading}
                                onClick={handleGoogleSignIn}
                                className="w-full py-6 flex items-center gap-3 border border-border-default hover:bg-elevated text-sm font-medium transition-all"
                            >
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                <span>Google Account</span>
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-sm text-text-secondary">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-accent hover:underline font-bold">Create one for free</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

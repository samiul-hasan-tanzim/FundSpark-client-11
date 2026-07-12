"use client";
import { useState } from "react";
import { Poppins, Inter } from "next/font/google";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [errors, setErrors] = useState({});

    const initializeCredits = async (token) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/initialize-credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch {
            // Non-critical — user can still log in
        }
    };

    const validate = (formData) => {
        const newErrors = {};
        const email = formData.get("email")?.trim();
        const password = formData.get("password");

        if (!email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Please enter a valid email address";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        const formData = new FormData(e.currentTarget);
        if (!validate(formData)) return;

        setLoading(true);

        const { data, error } = await authClient.signIn.email({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (error) {
            setApiError(error.message || error.statusText || "Login failed. Please try again.");
            toast.error(error.message || "Login failed");
            setLoading(false);
        } else if (data?.token && data?.user?.email) {
            toast.success("Welcome back!");
            await initializeCredits(data.user.email);
            const role = data?.user?.role || "supporter";
            window.location.href = role === "creator" ? "/dashboard/creator" : "/dashboard/supporter";
        } else {
            setLoading(false);
        }
    };

    const handelSocialAuth = async () => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
            toast.success("Welcome back!");
        } catch (err) {
            toast.error(err?.message || "Social login failed");
        }
        setLoading(false);
    };

    const inputClass = `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 ${inter.className}`;
    const errorInputClass = `w-full px-4 py-3 rounded-2xl border border-red-400 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ${inter.className}`;
    const labelClass = `block text-sm font-medium text-gray-700 mb-1.5 ${inter.className}`;
    const errorTextClass = `text-red-500 text-xs mt-1 ${inter.className}`;

    return (
        <section className="min-h-screen flex font-sans bg-[#F8FAFC]">
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#4F46E5] items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 -left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 -right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-center max-w-md">
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-[24px] flex items-center justify-center shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                    </div>
                    <h1 className={`text-4xl font-bold text-white mb-4 leading-tight ${poppins.className}`}>
                        Welcome Back
                    </h1>
                    <p className={`text-xl text-white/80 leading-relaxed ${inter.className}`}>
                        Log in to continue your journey
                    </p>
                    <div className="mt-10 space-y-4">
                        {[
                            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Track your campaign progress" },
                            { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", text: "Manage your contributions" },
                            { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", text: "See real-time funding updates" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/80 text-left">
                                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                </div>
                                <span className={`text-sm ${inter.className}`}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 lg:hidden">
                        <h1 className={`text-2xl font-bold text-gray-900 ${poppins.className}`}>Welcome Back</h1>
                        <p className={`text-gray-500 mt-1 text-sm ${inter.className}`}>Log in to continue your journey</p>
                    </div>

                    <div className="bg-white rounded-[24px] shadow-xl shadow-gray-200/50 p-8 lg:p-10">
                        {apiError && (
                            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className={`text-sm text-red-700 ${inter.className}`}>{apiError}</p>
                            </div>
                        )}

                        <form onSubmit={onSubmit} noValidate>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className={labelClass}>Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className={errors.email ? errorInputClass : inputClass}
                                        disabled={loading}
                                    />
                                    {errors.email && <p className={errorTextClass}>{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className={labelClass}>Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className={errors.password ? errorInputClass : inputClass}
                                        disabled={loading}
                                    />
                                    {errors.password && <p className={errorTextClass}>{errors.password}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${inter.className}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Logging in...
                                        </>
                                    ) : (
                                        "Log In"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className={`bg-white px-4 text-gray-400 ${inter.className}`}>or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handelSocialAuth}
                            disabled={loading}
                            className={`w-full py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-700 font-medium text-sm shadow-sm hover:bg-gray-50 hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${inter.className}`}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <p className={`text-center text-sm text-gray-500 mt-6 ${inter.className}`}>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-[#4F46E5] font-medium hover:text-[#7C3AED] hover:underline transition-colors">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
    const r = useRouter();
    const [email, setEmail] = useState("seeker@test.com");
    const [password, setPassword] = useState("test");
    const [error, setError] = useState<string | null>(null);

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold">Login</h1>

            <div className="mt-4 space-y-3">
                <input className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input className="w-full border rounded p-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                    className="w-full rounded bg-black text-white py-2 hover:opacity-90"
                    onClick={async () => {
                        setError(null);
                        try {
                            await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
                            r.push("/");
                        } catch (e: any) {
                            setError(e.message ?? "Login failed");
                        }
                    }}
                >
                    Login
                </button>

                <div className="text-sm text-gray-600">
                    No account? <Link className="underline" href="/signup">Sign up</Link>
                </div>

                <div className="text-xs text-gray-500">
                    Demo users: seeker@test.com / test and agent@test.com / test
                </div>
            </div>
        </main>
    );
}
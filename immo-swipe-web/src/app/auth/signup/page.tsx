"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Role } from "@/lib/types";

export default function SignupPage() {
    const r = useRouter();
    const [role, setRole] = useState<Role>("seeker");
    const [displayName, setDisplayName] = useState("New User");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("test");
    const [error, setError] = useState<string | null>(null);

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold">Sign up</h1>

            <div className="mt-4 space-y-3">
                <select className="w-full border rounded p-2" value={role} onChange={e => setRole(e.target.value as Role)}>
                    <option value="seeker">Seeker</option>
                    <option value="agent">Agent/Landlord</option>
                </select>

                <input className="w-full border rounded p-2" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name" />
                <input className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input className="w-full border rounded p-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                    className="w-full rounded bg-black text-white py-2 hover:opacity-90"
                    onClick={async () => {
                        setError(null);
                        try {
                            await api("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password, role, displayName }) });
                            r.push("/");
                        } catch (e: any) {
                            setError(e.message ?? "Signup failed");
                        }
                    }}
                >
                    Create account
                </button>

                <div className="text-sm text-gray-600">
                    Already have an account? <Link className="underline" href="/login">Login</Link>
                </div>
            </div>
        </main>
    );
}
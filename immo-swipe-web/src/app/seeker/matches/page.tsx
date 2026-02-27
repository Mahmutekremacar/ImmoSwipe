"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Match } from "@/lib/types";

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        api<Match[]>("/api/matches").then(setMatches);
    }, []);

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <div className="mt-4 space-y-2">
                {matches.map(m => (
                    <Link key={m.id} className="block rounded border p-3 hover:bg-gray-50" href={`/matches/${m.id}`}>
                        <div className="font-medium">Match {m.id.slice(0, 6)}</div>
                        <div className="text-xs text-gray-600">Updated: {new Date(m.updatedAt).toLocaleString()}</div>
                    </Link>
                ))}
                {matches.length === 0 ? <div className="text-gray-600">No matches yet. Like a listing to start.</div> : null}
            </div>
        </main>
    );
}
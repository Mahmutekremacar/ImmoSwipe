"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Listing } from "@/lib/types";
import SwipeDeck from "@/components/SwipeDeck";

export default function FeedPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    const current = useMemo(() => listings[0] ?? null, [listings]);

    useEffect(() => {
        api<Listing[]>("/api/feed")
            .then(setListings)
            .finally(() => setLoading(false));
    }, []);

    async function act(action: "like" | "dislike" | "save") {
        if (!current) return;
        await api(`/api/swipes/${current.id}`, { method: "PUT", body: JSON.stringify({ action }) });
        setListings(prev => prev.slice(1));
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-semibold text-center">Swipe listings</h1>
            <div className="mt-6">
                {loading ? <div className="text-center text-gray-600">Loading…</div> : <SwipeDeck listing={current} onAction={act} />}
            </div>
        </main>
    );
}
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SeekerPreferences } from "@/lib/types";

export default function PreferencesPage() {
    const [prefs, setPrefs] = useState<SeekerPreferences>({
        purpose: "rent",
        budgetMin: 800,
        budgetMax: 1600,
        roomsMin: 1,
        roomsMax: 3,
        city: "Berlin",
    });

    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        api<SeekerPreferences | null>("/api/me/preferences")
            .then(d => { if (d) setPrefs(d); })
            .catch(() => {});
    }, []);

    return (
        <main className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-semibold">Preferences</h1>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <label className="text-sm">
                    Purpose
                    <select className="w-full border rounded p-2 mt-1" value={prefs.purpose} onChange={e => setPrefs({ ...prefs, purpose: e.target.value as any })}>
                        <option value="rent">Rent</option>
                        <option value="buy">Buy</option>
                    </select>
                </label>

                <label className="text-sm">
                    City
                    <input className="w-full border rounded p-2 mt-1" value={prefs.city} onChange={e => setPrefs({ ...prefs, city: e.target.value })} />
                </label>

                <label className="text-sm">
                    Budget min
                    <input className="w-full border rounded p-2 mt-1" type="number" value={prefs.budgetMin} onChange={e => setPrefs({ ...prefs, budgetMin: Number(e.target.value) })} />
                </label>

                <label className="text-sm">
                    Budget max
                    <input className="w-full border rounded p-2 mt-1" type="number" value={prefs.budgetMax} onChange={e => setPrefs({ ...prefs, budgetMax: Number(e.target.value) })} />
                </label>

                <label className="text-sm">
                    Rooms min
                    <input className="w-full border rounded p-2 mt-1" type="number" value={prefs.roomsMin} onChange={e => setPrefs({ ...prefs, roomsMin: Number(e.target.value) })} />
                </label>

                <label className="text-sm">
                    Rooms max
                    <input className="w-full border rounded p-2 mt-1" type="number" value={prefs.roomsMax} onChange={e => setPrefs({ ...prefs, roomsMax: Number(e.target.value) })} />
                </label>
            </div>

            <button
                className="mt-4 px-4 py-2 rounded bg-black text-white hover:opacity-90"
                onClick={async () => {
                    await api("/api/me/preferences", { method: "PUT", body: JSON.stringify(prefs) });
                    setMsg("Saved!");
                    setTimeout(() => setMsg(null), 1200);
                }}
            >
                Save preferences
            </button>

            {msg ? <div className="mt-3 text-sm text-green-700">{msg}</div> : null}
        </main>
    );
}
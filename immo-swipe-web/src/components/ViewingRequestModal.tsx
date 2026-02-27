"use client";

import { useState } from "react";

export default function ViewingRequestModal({
                                                open,
                                                onClose,
                                                onSubmit,
                                            }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (preferredTimes: string, note?: string) => Promise<void>;
}) {
    const [preferredTimes, setPreferredTimes] = useState("Weekdays after 18:00 or Saturday morning");
    const [note, setNote] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Request a viewing</h3>
                    <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={onClose}>✕</button>
                </div>

                <label className="block mt-3 text-sm font-medium">Preferred times</label>
                <textarea className="w-full border rounded p-2 mt-1" rows={3} value={preferredTimes} onChange={e => setPreferredTimes(e.target.value)} />

                <label className="block mt-3 text-sm font-medium">Note (optional)</label>
                <textarea className="w-full border rounded p-2 mt-1" rows={3} value={note} onChange={e => setNote(e.target.value)} />

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-3 py-2 rounded border hover:bg-gray-50" onClick={onClose}>Cancel</button>
                    <button
                        className="px-3 py-2 rounded bg-black text-white hover:opacity-90"
                        onClick={async () => { await onSubmit(preferredTimes, note || undefined); onClose(); }}
                    >
                        Send request
                    </button>
                </div>
            </div>
        </div>
    );
}
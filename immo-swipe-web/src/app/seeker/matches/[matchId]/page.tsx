"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Message, User } from "@/lib/types";
import ChatThread from "@/components/ChatThread";
import ViewingRequestModal from "@/components/ViewingRequestModal";

export default function MatchChatPage({ params }: { params: { matchId: string } }) {
    const [me, setMe] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [openVR, setOpenVR] = useState(false);

    async function refresh() {
        const [meData, msgs] = await Promise.all([
            api<User>("/api/me"),
            api<Message[]>(`/api/matches/${params.matchId}/messages`),
        ]);
        setMe(meData);
        setMessages(msgs);
    }

    useEffect(() => { refresh(); }, []);

    return (
        <main className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Chat</h1>
                <button className="px-3 py-2 rounded border hover:bg-gray-50" onClick={() => setOpenVR(true)}>
                    Request viewing
                </button>
            </div>

            <div className="mt-4 rounded border bg-white p-4">
                {me ? <ChatThread messages={messages} me={me} /> : <div>Loading…</div>}
            </div>

            <div className="mt-3 flex gap-2">
                <input className="flex-1 border rounded p-2" value={text} onChange={e => setText(e.target.value)} placeholder="Message…" />
                <button
                    className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
                    onClick={async () => {
                        if (!text.trim()) return;
                        await api(`/api/matches/${params.matchId}/messages`, { method: "POST", body: JSON.stringify({ body: text }) });
                        setText("");
                        await refresh();
                    }}
                >
                    Send
                </button>
            </div>

            <ViewingRequestModal
                open={openVR}
                onClose={() => setOpenVR(false)}
                onSubmit={async (preferredTimes, note) => {
                    await api(`/api/matches/${params.matchId}/viewing-requests`, {
                        method: "POST",
                        body: JSON.stringify({ preferredTimes, note }),
                    });
                    await refresh();
                }}
            />
        </main>
    );
}
"use client";

import { Message, User } from "@/lib/types";

export default function ChatThread({ messages, me }: { messages: Message[]; me: User }) {
    return (
        <div className="flex flex-col gap-2">
            {messages.map(m => {
                const mine = m.senderUserId === me.id;
                return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-black text-white" : "bg-gray-100"}`}>
                            {m.type === "viewing_request" ? (
                                <div>
                                    <div className="font-semibold mb-1">Viewing request</div>
                                    <div>Preferred: {m.payload?.preferredTimes}</div>
                                    {m.payload?.note ? <div className="mt-1 text-xs opacity-80">{m.payload.note}</div> : null}
                                </div>
                            ) : (
                                <span>{m.body}</span>
                            )}
                            <div className="text-[10px] opacity-60 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
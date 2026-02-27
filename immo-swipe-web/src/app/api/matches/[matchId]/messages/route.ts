import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { addMessage, db, listMessages } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: { matchId: string } }) {
    try {
        requireUserId(req);
        return NextResponse.json({ data: listMessages(params.matchId) });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { matchId: string } }) {
    try {
        const userId = requireUserId(req);

        const match = db.matches.find(m => m.id === params.matchId);
        if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

        const isParticipant = match.seekerUserId === userId || match.agentUserId === userId;
        if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json().catch(() => ({}));
        const text = String(body.body ?? "").trim();
        if (!text) return NextResponse.json({ error: "Empty message" }, { status: 400 });

        const msg = addMessage(params.matchId, userId, "text", text);
        return NextResponse.json({ data: msg });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
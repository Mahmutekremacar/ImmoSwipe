import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { createViewingRequest, db } from "@/lib/store";

export async function POST(req: NextRequest, { params }: { params: { matchId: string } }) {
    try {
        const userId = requireUserId(req);

        const match = db.matches.find(m => m.id === params.matchId);
        if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

        const isParticipant = match.seekerUserId === userId || match.agentUserId === userId;
        if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json().catch(() => ({}));
        const preferredTimes = String(body.preferredTimes ?? "").trim();
        const note = body.note ? String(body.note) : undefined;

        if (!preferredTimes) return NextResponse.json({ error: "preferredTimes required" }, { status: 400 });

        const vr = createViewingRequest(params.matchId, userId, preferredTimes, note);
        return NextResponse.json({ data: vr });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
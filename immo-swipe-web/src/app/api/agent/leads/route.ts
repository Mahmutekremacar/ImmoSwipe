import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { agentLeads, db } from "@/lib/store";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        const user = db.users.find(u => u.id === userId);
        if (user?.role !== "agent") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        return NextResponse.json({ data: agentLeads(userId) });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
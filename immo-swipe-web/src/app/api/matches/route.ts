import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { listMatchesForUser } from "@/lib/store";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        return NextResponse.json({ data: listMatchesForUser(userId) });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
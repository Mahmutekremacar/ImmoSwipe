import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db } from "@/lib/store";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        const user = db.users.find(u => u.id === userId);
        if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ data: { id: user.id, email: user.email, role: user.role, displayName: user.displayName } });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
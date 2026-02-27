import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { db, ensureMatch, getListing, setSwipe } from "@/lib/store";
import { SwipeAction } from "@/lib/types";

export async function PUT(req: NextRequest, { params }: { params: { listingId: string } }) {
    try {
        const userId = requireUserId(req);
        const listing = getListing(params.listingId);
        if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

        const body = await req.json().catch(() => ({}));
        const action = body.action as SwipeAction;
        if (!["like", "dislike", "save"].includes(action)) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

        const swipe = setSwipe(userId, listing.id, action);

        // OPTIONAL: auto-create a match on LIKE (or you can wait for first message)
        if (action === "like") {
            const seeker = db.users.find(u => u.id === userId);
            if (seeker?.role === "seeker") {
                ensureMatch({ listingId: listing.id, seekerUserId: userId, agentUserId: listing.ownerUserId });
            }
        }

        return NextResponse.json({ data: swipe });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
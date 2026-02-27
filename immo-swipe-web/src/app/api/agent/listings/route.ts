import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { createListing, db, listMyListings } from "@/lib/store";
import { Listing } from "@/lib/types";

export async function GET(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        const user = db.users.find(u => u.id === userId);
        if (user?.role !== "agent") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        return NextResponse.json({ data: listMyListings(userId) });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = requireUserId(req);
        const user = db.users.find(u => u.id === userId);
        if (user?.role !== "agent") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json().catch(() => ({}));

        const input: Omit<Listing, "id" | "ownerUserId" | "createdAt" | "updatedAt"> = {
            status: "active",
            purpose: body.purpose ?? "rent",
            title: String(body.title ?? ""),
            description: String(body.description ?? ""),
            price: Number(body.price ?? 0),
            currency: "EUR",
            rooms: Number(body.rooms ?? 1),
            sizeSqm: body.sizeSqm ? Number(body.sizeSqm) : undefined,
            city: String(body.city ?? ""),
            mediaUrls: Array.isArray(body.mediaUrls) ? body.mediaUrls.map(String) : [],
        };

        if (!input.title || !input.city || !input.price) {
            return NextResponse.json({ error: "title, city, price required" }, { status: 400 });
        }

        const listing = createListing(userId, input);
        return NextResponse.json({ data: listing }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
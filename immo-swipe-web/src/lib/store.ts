import { Listing, Match, Message, SeekerPreferences, Swipe, User, ViewingRequest } from "./types";

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

type DB = {
    users: User[];
    preferences: Record<string, SeekerPreferences | undefined>; // userId -> prefs
    listings: Listing[];
    swipes: Swipe[];
    matches: Match[];
    messages: Message[];
    viewingRequests: ViewingRequest[];
};

declare global {
    // eslint-disable-next-line no-var
    var __db: DB | undefined;
}

const seed = (): DB => {
    const agentId = id();
    const seekerId = id();

    const users: User[] = [
        { id: agentId, email: "agent@test.com", password: "test", role: "agent", displayName: "Acme Realty", createdAt: now() },
        { id: seekerId, email: "seeker@test.com", password: "test", role: "seeker", displayName: "Alex", createdAt: now() },
    ];

    const listings: Listing[] = [
        {
            id: id(),
            ownerUserId: agentId,
            status: "active",
            purpose: "rent",
            title: "Bright 2-room apartment near Mitte",
            description: "Sunny, quiet, close to U-Bahn. Balcony included.",
            price: 1350,
            currency: "EUR",
            rooms: 2,
            sizeSqm: 55,
            city: "Berlin",
            mediaUrls: [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop",
            ],
            createdAt: now(),
            updatedAt: now(),
        },
        {
            id: id(),
            ownerUserId: agentId,
            status: "active",
            purpose: "rent",
            title: "Studio in Prenzlauer Berg",
            description: "Compact studio, furnished, great for students.",
            price: 980,
            currency: "EUR",
            rooms: 1,
            sizeSqm: 30,
            city: "Berlin",
            mediaUrls: [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop",
            ],
            createdAt: now(),
            updatedAt: now(),
        },
    ];

    return { users, preferences: {}, listings, swipes: [], matches: [], messages: [], viewingRequests: [] };
};

export const db: DB = globalThis.__db ?? seed();
globalThis.__db = db;

// --- Helpers
export function findUserByEmail(email: string) {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(params: { email: string; password: string; role: "seeker" | "agent"; displayName: string }) {
    const user: User = { id: id(), email: params.email, password: params.password, role: params.role, displayName: params.displayName, createdAt: now() };
    db.users.push(user);
    return user;
}

export function upsertPreferences(userId: string, prefs: SeekerPreferences) {
    db.preferences[userId] = prefs;
    return prefs;
}

export function getPreferences(userId: string) {
    return db.preferences[userId];
}

export function getListing(listingId: string) {
    return db.listings.find(l => l.id === listingId);
}

export function listMyListings(ownerUserId: string) {
    return db.listings.filter(l => l.ownerUserId === ownerUserId);
}

export function createListing(ownerUserId: string, input: Omit<Listing, "id" | "ownerUserId" | "createdAt" | "updatedAt">) {
    const listing: Listing = { ...input, id: id(), ownerUserId, createdAt: now(), updatedAt: now() };
    db.listings.push(listing);
    return listing;
}

export function setSwipe(userId: string, listingId: string, action: Swipe["action"]) {
    const existing = db.swipes.find(s => s.userId === userId && s.listingId === listingId);
    if (existing) {
        existing.action = action;
        existing.createdAt = now();
        return existing;
    }
    const swipe: Swipe = { userId, listingId, action, createdAt: now() };
    db.swipes.push(swipe);
    return swipe;
}

export function getUserSwipe(userId: string, listingId: string) {
    return db.swipes.find(s => s.userId === userId && s.listingId === listingId);
}

export function listSaved(userId: string) {
    const savedIds = db.swipes.filter(s => s.userId === userId && s.action === "save").map(s => s.listingId);
    return db.listings.filter(l => savedIds.includes(l.id));
}

export function listLiked(userId: string) {
    const likedIds = db.swipes.filter(s => s.userId === userId && s.action === "like").map(s => s.listingId);
    return db.listings.filter(l => likedIds.includes(l.id));
}

export function feedForUser(userId: string, prefs?: SeekerPreferences) {
    const seen = new Set(db.swipes.filter(s => s.userId === userId).map(s => s.listingId));
    let items = db.listings.filter(l => l.status === "active" && !seen.has(l.id));
    if (prefs) {
        items = items.filter(l =>
            l.purpose === prefs.purpose &&
            l.city.toLowerCase() === prefs.city.toLowerCase() &&
            l.price >= prefs.budgetMin &&
            l.price <= prefs.budgetMax &&
            l.rooms >= prefs.roomsMin &&
            l.rooms <= prefs.roomsMax
        );
    }
    return items;
}

export function ensureMatch(params: { listingId: string; seekerUserId: string; agentUserId: string }) {
    const existing = db.matches.find(m => m.listingId === params.listingId && m.seekerUserId === params.seekerUserId);
    if (existing) return existing;
    const match: Match = { id: id(), listingId: params.listingId, seekerUserId: params.seekerUserId, agentUserId: params.agentUserId, status: "active", createdAt: now(), updatedAt: now() };
    db.matches.push(match);
    return match;
}

export function listMatchesForUser(userId: string) {
    return db.matches
        .filter(m => m.seekerUserId === userId || m.agentUserId === userId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function addMessage(matchId: string, senderUserId: string, type: Message["type"], body?: string, payload?: any) {
    const msg: Message = { id: id(), matchId, senderUserId, type, body, payload, createdAt: now() };
    db.messages.push(msg);
    const match = db.matches.find(m => m.id === matchId);
    if (match) match.updatedAt = now();
    return msg;
}

export function listMessages(matchId: string) {
    return db.messages.filter(m => m.matchId === matchId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createViewingRequest(matchId: string, requestedByUserId: string, preferredTimes: string, note?: string) {
    const vr: ViewingRequest = { id: id(), matchId, requestedByUserId, preferredTimes, note, status: "pending", createdAt: now(), updatedAt: now() };
    db.viewingRequests.push(vr);
    addMessage(matchId, requestedByUserId, "viewing_request", undefined, { viewingRequestId: vr.id, preferredTimes, note, status: vr.status });
    return vr;
}

export function agentLeads(agentUserId: string) {
    const myListingIds = new Set(db.listings.filter(l => l.ownerUserId === agentUserId).map(l => l.id));
    const likes = db.swipes.filter(s => myListingIds.has(s.listingId) && s.action === "like");
    return likes
        .map(like => ({
            listing: db.listings.find(l => l.id === like.listingId)!,
            seeker: db.users.find(u => u.id === like.userId)!,
            likedAt: like.createdAt,
        }))
        .sort((a, b) => b.likedAt.localeCompare(a.likedAt));
}
export type Role = "seeker" | "agent";

export type User = {
    id: string;
    email: string;
    password: string; // MVP ONLY. Replace with hash in real backend.
    role: Role;
    displayName: string;
    createdAt: string;
};

export type SeekerPreferences = {
    purpose: "rent" | "buy";
    budgetMin: number;
    budgetMax: number;
    roomsMin: number;
    roomsMax: number;
    city: string;
};

export type Listing = {
    id: string;
    ownerUserId: string;
    status: "active" | "paused" | "closed";
    purpose: "rent" | "buy";
    title: string;
    description: string;
    price: number;
    currency: "EUR";
    rooms: number;
    sizeSqm?: number;
    city: string;
    mediaUrls: string[]; // MVP: store URLs directly
    createdAt: string;
    updatedAt: string;
};

export type SwipeAction = "like" | "dislike" | "save";

export type Swipe = {
    userId: string;
    listingId: string;
    action: SwipeAction;
    createdAt: string;
};

export type Match = {
    id: string;
    listingId: string;
    seekerUserId: string;
    agentUserId: string;
    status: "active" | "closed" | "blocked";
    updatedAt: string;
    createdAt: string;
};

export type Message = {
    id: string;
    matchId: string;
    senderUserId: string;
    type: "text" | "system" | "viewing_request";
    body?: string;
    payload?: any;
    createdAt: string;
};

export type ViewingRequest = {
    id: string;
    matchId: string;
    requestedByUserId: string;
    preferredTimes: string;
    note?: string;
    status: "pending" | "accepted" | "declined" | "scheduled";
    createdAt: string;
    updatedAt: string;
};
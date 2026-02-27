"use client";

import { Listing } from "@/lib/types";
import ListingCard from "./ListingCard";

export default function SwipeDeck({
                                      listing,
                                      onAction,
                                  }: {
    listing: Listing | null;
    onAction: (action: "like" | "dislike" | "save") => void;
}) {
    if (!listing) {
        return <div className="text-center p-10 text-gray-600">No more listings. Adjust your preferences.</div>;
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <ListingCard listing={listing} />
            <div className="flex justify-center gap-3 mt-4">
                <button onClick={() => onAction("dislike")} className="px-4 py-2 rounded border hover:bg-gray-50">❌ Skip</button>
                <button onClick={() => onAction("save")} className="px-4 py-2 rounded border hover:bg-gray-50">⭐ Save</button>
                <button onClick={() => onAction("like")} className="px-4 py-2 rounded bg-black text-white hover:opacity-90">❤️ Like</button>
            </div>
        </div>
    );
}
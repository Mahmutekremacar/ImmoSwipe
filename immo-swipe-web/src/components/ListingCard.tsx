import { Listing } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
    const hero = listing.mediaUrls[0];
    return (
        <div className="rounded-xl border overflow-hidden bg-white shadow-sm">
            {hero ? <img src={hero} alt={listing.title} className="w-full h-64 object-cover" /> : null}
            <div className="p-4">
                <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <div className="font-semibold">{listing.price} {listing.currency}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{listing.city} · {listing.rooms} rooms{listing.sizeSqm ? ` · ${listing.sizeSqm} m²` : ""}</div>
                <p className="text-sm mt-3 text-gray-800 line-clamp-3">{listing.description}</p>
            </div>
        </div>
    );
}
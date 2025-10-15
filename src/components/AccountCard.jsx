"use client";

import { useState } from "react";
import ListingDetailsModal from "./ListingDetailsModal";

export default function AccountCard({ account }) {
  const [selectedListing, setSelectedListing] = useState(null);

  return (
    <div className="border p-4 rounded-xl shadow-md hover:shadow-xl transition bg-white">
      <h2 className="font-semibold text-lg mb-2 text-blue-700">
        {account.email}
      </h2>

      {account.listings.length === 0 ? (
        <p>No GMB accounts found.</p>
      ) : (
        <ul className="list-disc ml-5 space-y-1">
          {account.listings.map((listing, i) => (
            <li
              key={i}
              className="flex justify-between items-center text-gray-800"
            >
              <span>{listing.name}</span>
              <button
                onClick={() => setSelectedListing(listing)}
                className="text-sm text-blue-600 hover:underline"
              >
                More Details
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}

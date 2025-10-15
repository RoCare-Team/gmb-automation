"use client";

export default function ListingDetailsModal({ listing, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {listing.locationName || "Listing Details"}
        </h2>

        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {listing.name || "N/A"}
          </p>
          <p>
            <strong>Store Code:</strong> {listing.storeCode || "N/A"}
          </p>
          <p>
            <strong>Primary Category:</strong>{" "}
            {listing.primaryCategory?.displayName || "N/A"}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            {listing.websiteUri ? (
              <a
                href={listing.websiteUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {listing.websiteUri}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Phone:</strong> {listing.phoneNumbers?.primaryPhone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {listing.address?.regionCode
              ? `${listing.address?.addressLines?.join(", ")}, ${
                  listing.address?.regionCode
                }`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

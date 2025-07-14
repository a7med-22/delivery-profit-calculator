// components/TripForm.tsx
"use client";

import { useState } from "react";

interface TripFormProps {
  onAddTrip: (trip: { distance: number; price: number }) => void;
}

export default function TripForm({ onAddTrip }: TripFormProps) {
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (distance > 0 && price > 0) {
      onAddTrip({ distance, price });
      setDistance(0);
      setPrice(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow mb-6 max-w-md mx-auto"
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium">المسافة (كم)</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          min={0}
          step={0.1}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">السعر (جنيه)</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          min={0}
          step={0.1}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        إضافة الرحلة
      </button>
    </form>
  );
}

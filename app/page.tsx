// app/page.tsx
"use client";

import TripForm from "@/components/TripForm";
import TripTable from "@/components/TripTable";
import Summary from "@/components/Summary";
import { useState, useEffect } from "react";

interface Trip {
  id: number;
  distance: number;
  price: number;
  cost: number;
  profit: number;
  valuePerKm: number;
}

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("trips");
    if (stored) {
      setTrips(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip: { distance: number; price: number }) => {
    const costPerKm = 3.0;
    const cost = trip.distance * costPerKm;
    const profit = trip.price - cost;
    const valuePerKm = trip.price / trip.distance;

    setTrips([
      ...trips,
      {
        ...trip,
        cost,
        profit,
        valuePerKm,
        id: Date.now(),
      },
    ]);
  };

  const deleteTrip = (id: number) => {
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <main className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">
        حاسبة أرباح الرحلات
      </h1>
      <TripForm onAddTrip={addTrip} />
      <TripTable trips={trips} onDeleteTrip={deleteTrip} />
      <Summary trips={trips} />
    </main>
  );
}

// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import TripForm from "./components/TripForm";
import TripTable from "./components/TripTable";
import Link from "next/link";

interface Trip {
  id: number;
  distance: number;
  price: number;
  cost: number;
  profit: number;
  valuePerKm: number;
}

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [costPerKm, setCostPerKm] = useState<number | null>(null);

  useEffect(() => {
    const storedTrips = localStorage.getItem("trips");
    if (storedTrips) {
      setTrips(JSON.parse(storedTrips));
    }

    const carSettings = localStorage.getItem("carSettings");
    if (carSettings) {
      const data = JSON.parse(localStorage.getItem("carSettings")!);
      const costPerKm =
        (data.fuelConsumption / 100) * data.fuelPrice + data.extraCostPerKm;
      setCostPerKm(Number(costPerKm.toFixed(2)));
    }
  }, []);

  const addTrip = ({
    distance,
    price,
  }: {
    distance: number;
    price: number;
  }) => {
    if (costPerKm === null) {
      alert("يرجى إدخال بيانات السيارة أولاً من صفحة الإعدادات.");
      return;
    }

    const cost = distance * costPerKm;
    const profit = price - cost;
    const valuePerKm = price / distance;

    const newTrip: Trip = {
      id: Date.now(),
      distance,
      price,
      cost,
      profit,
      valuePerKm,
    };

    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  const deleteTrip = (id: number) => {
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    localStorage.setItem("trips", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        حاسبة توصيل المشاوير
      </h1>

      <TripForm onAddTrip={addTrip} />
      <TripTable trips={trips} onDeleteTrip={deleteTrip} />

      <div className="text-center mt-6">
        <Link href="/car" className="text-blue-600 hover:underline">
          ⚙️ إعدادات السيارة
        </Link>
        <span className="mx-2">|</span>
        <Link href="/report" className="text-blue-600 hover:underline">
          📊 التقرير
        </Link>
      </div>
    </main>
  );
}

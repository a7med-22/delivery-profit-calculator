// app/report/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  format,
  isSameDay,
  isWithinInterval,
  subDays,
  startOfMonth,
} from "date-fns";
import WeeklyChart from "@/components/WeeklyChart";

interface Trip {
  id: number;
  distance: number;
  price: number;
  cost: number;
  profit: number;
  valuePerKm: number;
}

export default function ReportPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    const stored = localStorage.getItem("trips");
    if (stored) {
      const allTrips: Trip[] = JSON.parse(stored);
      setTrips(allTrips);
      applyFilter("today", allTrips);
    }
  }, []);

  const applyFilter = (type: string, allTrips = trips) => {
    const now = new Date();
    let filtered: Trip[] = [];

    if (type === "today") {
      filtered = allTrips.filter((t) => isSameDay(new Date(t.id), now));
    } else if (type === "week") {
      filtered = allTrips.filter((t) =>
        isWithinInterval(new Date(t.id), { start: subDays(now, 6), end: now })
      );
    } else if (type === "month") {
      filtered = allTrips.filter((t) =>
        isWithinInterval(new Date(t.id), { start: startOfMonth(now), end: now })
      );
    }

    setFilter(type);
    setFilteredTrips(filtered);
  };

  const total = filteredTrips.reduce(
    (acc, t) => {
      acc.profit += t.profit;
      acc.distance += t.distance;
      acc.price += t.price;
      return acc;
    },
    { profit: 0, distance: 0, price: 0 }
  );

  return (
    <main className="min-h-screen p-4 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">تقرير الأرباح</h1>

      <div className="max-w-xl mx-auto mb-4 text-center">
        <button
          onClick={() => applyFilter("today")}
          className={`px-3 py-1 rounded mx-1 ${
            filter === "today" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          اليوم
        </button>
        <button
          onClick={() => applyFilter("week")}
          className={`px-3 py-1 rounded mx-1 ${
            filter === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          آخر ٧ أيام
        </button>
        <button
          onClick={() => applyFilter("month")}
          className={`px-3 py-1 rounded mx-1 ${
            filter === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          هذا الشهر
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-gray-100 rounded-xl shadow p-4 text-right">
        <p className="mb-2 font-medium">عدد الرحلات: {filteredTrips.length}</p>
        <p className="mb-2 font-medium">
          المسافة الإجمالية: {total.distance.toFixed(2)} كم
        </p>
        <p className="mb-2 font-medium">الدخل: {total.price.toFixed(2)} جنيه</p>
        <p className="mb-2 font-medium text-green-700">
          الربح: {total.profit.toFixed(2)} جنيه
        </p>
      </div>

      {trips.length > 0 && (
        <div className="mt-8">
          <WeeklyChart trips={trips} />
        </div>
      )}

      <div className="mt-6 text-center">
        <a href="/" className="text-blue-600 hover:underline">
          ↩ الرجوع إلى الصفحة الرئيسية
        </a>
      </div>
    </main>
  );
}

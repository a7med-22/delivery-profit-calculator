// components/WeeklyChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

interface Trip {
  id: number;
  distance: number;
  price: number;
  cost: number;
  profit: number;
  valuePerKm: number;
}

export default function WeeklyChart({ trips }: { trips: Trip[] }) {
  const today = new Date();
  const pastWeekDays = Array.from({ length: 7 }, (_, i) =>
    subDays(today, 6 - i)
  );

  const data = pastWeekDays.map((date) => {
    const dayTrips = trips.filter(
      (t) => format(new Date(t.id), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    const totalProfit = dayTrips.reduce((sum, t) => sum + t.profit, 0);
    return {
      day: format(date, "EEE"),
      profit: Number(totalProfit.toFixed(2)),
    };
  });

  return (
    <div className="w-full h-64">
      <h2 className="text-xl font-bold mb-2 text-center">
        الربح خلال آخر ٧ أيام
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="profit" fill="#4ade80" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

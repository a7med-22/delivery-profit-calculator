// components/Summary.tsx
"use client";

interface Trip {
  id: number;
  distance: number;
  price: number;
  cost: number;
  profit: number;
  valuePerKm: number;
}

export default function Summary({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) return null;

  const totalTrips = trips.length;
  const totalProfit = trips.reduce((sum, t) => sum + t.profit, 0);
  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
  const totalRevenue = trips.reduce((sum, t) => sum + t.price, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-center">ملخص الأرباح</h2>
      <div className="grid grid-cols-2 gap-4 text-right">
        <div>
          <p className="font-medium">عدد الرحلات:</p>
          <p>{totalTrips}</p>
        </div>
        <div>
          <p className="font-medium">إجمالي المسافة:</p>
          <p>{totalDistance.toFixed(2)} كم</p>
        </div>
        <div>
          <p className="font-medium">إجمالي الدخل:</p>
          <p>{totalRevenue.toFixed(2)} جنيه</p>
        </div>
        <div>
          <p className="font-medium">إجمالي الربح:</p>
          <p className="text-green-700 font-semibold">
            {totalProfit.toFixed(2)} جنيه
          </p>
        </div>
      </div>
    </div>
  );
}

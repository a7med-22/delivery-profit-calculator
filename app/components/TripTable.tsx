// components/TripTable.tsx
"use client";

interface Trip {
  id: number;
  distance: number;
  price: number;
  cost: number;
  profit: number;
  valuePerKm: number;
}

interface TripTableProps {
  trips: Trip[];
  onDeleteTrip: (id: number) => void;
}

export default function TripTable({ trips, onDeleteTrip }: TripTableProps) {
  if (trips.length === 0) return null;

  const getEvaluation = (valuePerKm: number) => {
    if (valuePerKm < 3) return "❌ خساير";
    if (valuePerKm < 4) return "✅ مكسب بسيط";
    if (valuePerKm < 5) return "✅ جيد";
    return "✅✅ ممتاز";
  };

  return (
    <div className="max-w-4xl mx-auto overflow-x-auto">
      <table className="w-full bg-white rounded-xl shadow mb-6">
        <thead>
          <tr className="bg-gray-200 text-right">
            <th className="p-3">#</th>
            <th className="p-3">المسافة (كم)</th>
            <th className="p-3">السعر (جنيه)</th>
            <th className="p-3">الربح (جنيه)</th>
            <th className="p-3">تقييم</th>
            <th className="p-3">حذف</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={trip.id} className="text-right border-t">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{trip.distance}</td>
              <td className="p-3">{trip.price}</td>
              <td className="p-3 text-green-700 font-semibold">
                {trip.profit.toFixed(2)}
              </td>
              <td className="p-3">{getEvaluation(trip.valuePerKm)}</td>
              <td className="p-3">
                <button
                  onClick={() => onDeleteTrip(trip.id)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

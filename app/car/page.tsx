// app/car/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function CarSettingsPage() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const [fuelPrice, setFuelPrice] = useState(0);
  const [extraCostPerKm, setExtraCostPerKm] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("carSettings");
    if (stored) {
      const data = JSON.parse(stored);
      setMake(data.make || "");
      setModel(data.model || "");
      setYear(data.year || "");
      setFuelConsumption(data.fuelConsumption || 0);
      setFuelPrice(data.fuelPrice || 0);
      setExtraCostPerKm(data.extraCostPerKm || 0);
    }
  }, []);

  const fetchCarData = async () => {
    if (!make || !model || !year) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/cars?make=${make}&model=${model}&year=${year}`,
        {
          headers: { "X-Api-Key": "5yZ/BgabhuKDRWMzN935YQ==hMLuI91VCBJWTgtF" },
        }
      );
      const data = await response.json();
      if (data.length > 0) {
        const car = data[0];
        setFuelConsumption(car.fuel_consumption_city || 6.5);
      } else {
        setError("لا توجد بيانات متاحة لهذه السيارة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = () => {
    const settings = {
      make,
      model,
      year,
      fuelConsumption,
      fuelPrice,
      extraCostPerKm,
    };
    localStorage.setItem("carSettings", JSON.stringify(settings));
    alert("✅ تم حفظ البيانات بنجاح");
  };

  return (
    <main className="min-h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">إعدادات السيارة</h1>

      <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded-xl shadow space-y-4">
        <input
          className="w-full p-2 rounded"
          placeholder="ماركة السيارة (مثال: Fiat)"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          className="w-full p-2 rounded"
          placeholder="الموديل (مثال: Tipo)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          className="w-full p-2 rounded"
          placeholder="السنة (مثال: 2022)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <button
          onClick={fetchCarData}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "جاري التحميل..." : "جلب بيانات السيارة تلقائيًا"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="number"
          step="0.1"
          className="w-full p-2 rounded"
          placeholder="استهلاك الوقود (لتر لكل 100 كم)"
          value={fuelConsumption}
          onChange={(e) => setFuelConsumption(Number(e.target.value))}
        />
        <input
          type="number"
          step="0.01"
          className="w-full p-2 rounded"
          placeholder="سعر البنزين (جنيه لكل لتر)"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(Number(e.target.value))}
        />
        <input
          type="number"
          step="0.01"
          className="w-full p-2 rounded"
          placeholder="تكاليف إضافية لكل كم (صيانة، كاوتش، أكل...)"
          value={extraCostPerKm}
          onChange={(e) => setExtraCostPerKm(Number(e.target.value))}
        />

        <button
          onClick={saveSettings}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          حفظ البيانات
        </button>
      </div>
    </main>
  );
}

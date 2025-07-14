"use client";

import { useState, useEffect } from "react";
import { parseStringPromise } from "xml2js";

export default function CarSettingsPage() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const [fuelPrice, setFuelPrice] = useState(17.5);
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
      setFuelPrice(data.fuelPrice || 17.5);
      setExtraCostPerKm(data.extraCostPerKm || 0);
    }
  }, []);

  const fetchCarData = async () => {
    if (!make || !model || !year) {
      setError("يرجى إدخال الماركة والموديل والسنة");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 1. جلب options للسيارة
      const res1 = await fetch(
        encodeURI(
          `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`
        )
      );
      console.log("Fetching car options:", res1);
      const xml1 = await res1.text();
      const json1 = await parseStringPromise(xml1);
      const menuItems = json1.menuItems.menuItem;
      if (!menuItems || menuItems.length === 0) {
        setError("لا توجد بيانات لهذه السيارة");
        setLoading(false);
        return;
      }
      // خذ أول vehicleId
      const vehicleId = menuItems[0].value[0];

      // 2. جلب استهلاك السيارة
      const res2 = await fetch(
        `https://www.fueleconomy.gov/ws/rest/vehicle/${vehicleId}`
      );
      console.log("Fetching car consumption data:", res2);
      const xml2 = await res2.text();
      const json2 = await parseStringPromise(xml2);
      console.log("Car consumption data:", json2);
      const city = parseFloat(json2.vehicle.city08[0]);
      const hwy = parseFloat(json2.vehicle.highway08[0]);

      const avgConsumption = (city + hwy) / 2; // لتر / 100 كم تقريبا
      setFuelConsumption(Number(avgConsumption.toFixed(2)));
    } catch (err) {
      console.error(err);
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
          placeholder="ماركة السيارة"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          className="w-full p-2 rounded"
          placeholder="الموديل"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          className="w-full p-2 rounded"
          placeholder="السنة"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          onClick={fetchCarData}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "جاري التحميل..." : "جلب بيانات السيارة"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="number"
          step="0.1"
          className="w-full p-2 rounded"
          placeholder="لتر/100 كم"
          value={fuelConsumption}
          onChange={(e) => setFuelConsumption(Number(e.target.value))}
        />
        <input
          type="number"
          step="0.01"
          className="w-full p-2 rounded"
          placeholder="سعر لتر البنزين"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(Number(e.target.value))}
        />
        <input
          type="number"
          step="0.01"
          className="w-full p-2 rounded"
          placeholder="تكلفة إضافية لكل كم"
          value={extraCostPerKm}
          onChange={(e) => setExtraCostPerKm(Number(e.target.value))}
        />
        <button
          onClick={saveSettings}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          حفظ الإعدادات
        </button>
      </div>
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import { PreviousShifts } from "./previous-shifts";
import { MileageForm } from "./mileage-form";
import { MileageStatistics } from "./mileage-statistics";
import { ThemeToggle } from "./theme-toggle";
import { MileageOverview } from "./mileage-overview";
import { Driver, ShiftData } from "@/types/types"; // Import the types

const BASE_MILEAGE = 43288;

export default function TaxiMileageTracker() {
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [currentMileage, setCurrentMileage] = useState(BASE_MILEAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShiftData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/shifts");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setShiftData(data);

        if (data.length > 0) {
          const latestEndMileage = data[data.length - 1].endMileage;
          setCurrentMileage(latestEndMileage);
        }
      } catch (error) {
        console.error("Error fetching shift data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShiftData();
  }, []);

  const addShiftData = async (newShift: ShiftData) => {
    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newShift),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const savedShift = await response.json();
      setShiftData((prevData) => [...prevData, savedShift]);
      setCurrentMileage(savedShift.endMileage);
    } catch (error) {
      console.error("Error adding shift data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Taxi Mileage Tracker</h1>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MileageOverview shiftData={shiftData} isLoading={isLoading} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <MileageForm onSubmit={addShiftData} baseMileage={currentMileage} />
          <MileageStatistics
            shiftData={shiftData}
            monthlyLimit={8000}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-6">
          <PreviousShifts shiftData={shiftData} />
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MileageForm } from "./mileage-form";
import { WeeklyStats } from "./weekly-stats";
import { MonthlyStats } from "./monthly-stats";

type Driver = "Oskar" | "Mateusz";
type ShiftData = {
  date: string;
  driver: Driver;
  mileage: number;
  endMileage: number;
};

const BASE_MILEAGE = 43288;

export default function TaxiMileageTracker() {
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [currentMileage, setCurrentMileage] = useState(BASE_MILEAGE);

  // Load data from the API on component mount
  useEffect(() => {
    const fetchShiftData = async () => {
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
      }
    };

    fetchShiftData();
  }, []);

  const addShiftData = async (newShift: {
    date: string;
    driver: Driver;
    mileage: number;
    endMileage: number;
  }) => {
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
      setShiftData((prevData) => [...prevData, savedShift]); // Update local state
      setCurrentMileage(savedShift.endMileage);
    } catch (error) {
      console.error("Error adding shift data:", error);
    }
  };

  return (
    <div className="container maxw-md mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Taxi Mileage Tracker
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Enter Shift Data</CardTitle>
        </CardHeader>
        <CardContent>
          <MileageForm onSubmit={addShiftData} baseMileage={currentMileage} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyStats shiftData={shiftData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyStats shiftData={shiftData} monthlyLimit={8000} />
        </CardContent>
      </Card>
    </div>
  );
}

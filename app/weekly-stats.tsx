import { useMemo } from "react";
import { format } from "date-fns";

type Driver = "Oskar" | "Mateusz";
type ShiftData = {
  date: string;
  driver: Driver;
  mileage: number;
  endMileage: number;
};

type WeeklyStatsProps = {
  shiftData: ShiftData[];
};

export function WeeklyStats({ shiftData }: WeeklyStatsProps) {
  const { weeklyStats, weekRange } = useMemo(() => {
    const now = new Date();

    // Get the current date and calculate the start of the week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Set to Monday

    // Adjust if today is Sunday (get the previous week's Monday)
    if (now.getDay() === 0) {
      startOfWeek.setDate(startOfWeek.getDate() - 7);
    }

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday

    const weeklyData = shiftData
      .filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= startOfWeek && shiftDate <= endOfWeek;
      })
      .reduce(
        (acc, shift) => {
          acc[shift.driver] = (acc[shift.driver] || 0) + shift.mileage;
          return acc;
        },
        {} as Record<Driver, number>
      );

    const weekRangeText = `${format(startOfWeek, "MMMM d")} - ${format(endOfWeek, "MMMM d, yyyy")}`;

    return {
      weeklyStats: weeklyData,
      weekRange: weekRangeText,
    };
  }, [shiftData]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-2">Week: {weekRange}</p>
      <h3 className="text-lg font-semibold">Kilometers driven this week:</h3>
      <ul className="list-disc pl-5">
        <li>Oskar: {weeklyStats["Oskar"] || 0} km</li>
        <li>Mateusz: {weeklyStats["Mateusz"] || 0} km</li>
        <li className="font-semibold mt-2">
          Total: {(weeklyStats["Oskar"] || 0) + (weeklyStats["Mateusz"] || 0)}{" "}
          km
        </li>
      </ul>
    </div>
  );
}

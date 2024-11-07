import React, { useMemo } from "react";
import { isWithinInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";
import { Separator } from "./ui/separator";
import { 
  formatMonthYear, 
  formatMonthDay, 
  formatMonthDayYear,
  getWeekRange, 
  getMonthRange 
} from "@/utils/dates";
import { Driver, ShiftData } from "@/types/types";

interface MileageStatisticsProps {
  shiftData: ShiftData[];
  monthlyLimit: number;
  isLoading: boolean;
}

export function MileageStatistics({
  shiftData,
  monthlyLimit,
  isLoading,
}: MileageStatisticsProps) {
  const [
    weeklyStats,
    monthlyTotals,
    weekRange,
    monthLabel,
    totalMonthlyMileage,
    progressPercentage,
  ] = useMemo(() => {
    const now = new Date();
    const { start: weekStart, end: weekEnd } = getWeekRange(now);
    const { start: monthStart } = getMonthRange(now);

    const weekly = shiftData
      .filter((shift) => {
        const shiftDate = new Date(shift.date);
        return isWithinInterval(shiftDate, { start: weekStart, end: weekEnd });
      })
      .reduce((acc, shift) => {
        acc[shift.driver] = (acc[shift.driver] || 0) + shift.mileage;
        return acc;
      }, {} as Record<Driver, number>);

    const monthly = shiftData
      .filter((shift) => {
        const shiftDate = new Date(shift.date);
        return isWithinInterval(shiftDate, getMonthRange(now));
      })
      .reduce(
        (acc, shift) => {
          acc[shift.driver] = (acc[shift.driver] || 0) + shift.mileage;
          return acc;
        },
        { Oskar: 0, Mateusz: 0 } as Record<Driver, number>
      );

    const weekRangeText = `${formatMonthDay(weekStart)} - ${formatMonthDayYear(weekEnd)}`;
    const monthLabelText = formatMonthYear(monthStart);

    const totalMonthly = monthly.Oskar + monthly.Mateusz;
    const percentage = (totalMonthly / monthlyLimit) * 100;

    return [
      weekly,
      monthly,
      weekRangeText,
      monthLabelText,
      totalMonthly,
      percentage,
    ];
  }, [shiftData, monthlyLimit]);

  const weeklyTotal =
    (weeklyStats["Oskar"] || 0) + (weeklyStats["Mateusz"] || 0);

  if (isLoading) {
    return (
      <Card className=" h-[579px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Mileage Statistics</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Mileage Statistics</CardTitle>
        <PieChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Weekly Stats</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Week: {weekRange}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Oskar</p>
              <p className="text-2xl font-bold">
                {weeklyStats["Oskar"] || 0} km
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Mateusz</p>
              <p className="text-2xl font-bold">
                {weeklyStats["Mateusz"] || 0} km
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium">Total</p>
            <p className="text-3xl font-bold">{weeklyTotal} km</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Monthly Stats</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Month: {monthLabel}
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Oskar</span>
                <span className="text-sm">{monthlyTotals.Oskar} km</span>
              </div>
              <Progress
                value={(monthlyTotals.Oskar / totalMonthlyMileage) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Mateusz</span>
                <span className="text-sm">{monthlyTotals.Mateusz} km</span>
              </div>
              <Progress
                value={(monthlyTotals.Mateusz / totalMonthlyMileage) * 100}
                className="h-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Total</span>
              <span>{totalMonthlyMileage} km</span>
            </div>

            <Progress value={progressPercentage} className="h-2 mt-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% of monthly limit (
              {monthlyLimit.toLocaleString()} km)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
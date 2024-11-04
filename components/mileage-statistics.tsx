import { PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useMemo } from "react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

type Driver = "Oskar" | "Mateusz";
type ShiftData = {
  date: string;
  driver: Driver;
  mileage: number;
  endMileage: number;
};

type MileageStatisticsProps = {
  shiftData: ShiftData[];
  monthlyLimit: number;
  isLoading: boolean;
};

export function MileageStatistics({ shiftData, monthlyLimit, isLoading }: MileageStatisticsProps) {
  // Weekly Stats Calculation
  const { weeklyStats, weekRange } = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);

    if (now.getDay() === 0) {
      startOfWeek.setDate(startOfWeek.getDate() - 7);
    }

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

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

    const weekRangeText = `${format(startOfWeek, "MMMM d")} - ${format(
      endOfWeek,
      "MMMM d, yyyy"
    )}`;

    return {
      weeklyStats: weeklyData,
      weekRange: weekRangeText,
    };
  }, [shiftData]);

  // Monthly Stats Calculation
  const { monthlyTotals, monthLabel, totalMonthlyMileage, progressPercentage } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthLabelText = format(startOfMonth, 'MMMM yyyy');

    const totals = shiftData
      .filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= startOfMonth;
      })
      .reduce((acc, shift) => {
        acc[shift.driver] = (acc[shift.driver] || 0) + shift.mileage;
        return acc;
      }, { Oskar: 0, Mateusz: 0 } as Record<Driver, number>);

    const total = totals.Oskar + totals.Mateusz;
    const percentage = (total / monthlyLimit) * 100;

    return {
      monthlyTotals: totals,
      monthLabel: monthLabelText,
      totalMonthlyMileage: total,
      progressPercentage: percentage,
    };
  }, [shiftData, monthlyLimit]);

  const weeklyTotal = (weeklyStats["Oskar"] || 0) + (weeklyStats["Mateusz"] || 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Mileage Statistics</CardTitle>
        <PieChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Weekly Stats</h3>
          <p className="text-sm text-muted-foreground mb-4">Week: {weekRange}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Oskar</p>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{weeklyStats["Oskar"] || 0} km</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Mateusz</p>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold">{weeklyStats["Mateusz"] || 0} km</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium">Total</p>
            {isLoading ? (
              <Skeleton className="h-9 w-36" />
            ) : (
              <p className="text-3xl font-bold">{weeklyTotal} km</p>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Monthly Stats</h3>
          <p className="text-sm text-muted-foreground mb-4">Month: {monthLabel}</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Oskar</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="text-sm">{monthlyTotals.Oskar} km</span>
                )}
              </div>
              <Progress value={(monthlyTotals.Oskar / monthlyLimit) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Mateusz</span>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="text-sm">{monthlyTotals.Mateusz} km</span>
                )}
              </div>
              <Progress value={(monthlyTotals.Mateusz / monthlyLimit) * 100} className="h-2" />
            </div>
          </div>
          <div className="mt-4">
              <p className="text-sm font-medium">Total: {totalMonthlyMileage} km</p>
            <Progress value={progressPercentage} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progressPercentage.toFixed(1)}% of monthly limit ({monthlyLimit.toLocaleString()} km)
              </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { Car, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShiftData } from "@/types/types"; // Import the ShiftData type

export function MileageOverview({
  shiftData,
  isLoading = false,
}: {
  shiftData: ShiftData[];
  isLoading?: boolean;
}) {
  const latestEndMileage =
    shiftData.length > 0 ? shiftData[shiftData.length - 1].endMileage : 0;

  const totalMileage = shiftData.reduce((sum, shift) => sum + shift.mileage, 0);
  const averageDailyDistance =
    shiftData.length > 0 ? totalMileage / shiftData.length : 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Mileage</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-9 w-[120px]" />
          ) : (
            <div className="text-3xl font-bold">
              {latestEndMileage.toLocaleString()} km
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Shift Mileage
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-9 w-[100px]" />
          ) : (
            <div className="text-3xl font-bold">
              {Math.round(averageDailyDistance).toLocaleString()} km
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
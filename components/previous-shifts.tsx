import React, { useMemo } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { isWithinInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatMonthYear, getMonthRange } from "@/utils/dates";
import { Driver, ShiftData } from "@/types/types"; // Import the types

interface PreviousShiftsProps {
  shiftData: ShiftData[];
}

export function PreviousShifts({ shiftData }: PreviousShiftsProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const filteredShifts = useMemo(() => {
    const monthRange = getMonthRange(currentMonth);
    return shiftData
      .filter((shift) => {
        const shiftDate = new Date(shift.date);
        return isWithinInterval(shiftDate, monthRange);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [shiftData, currentMonth]);

  const monthNavigation = useMemo(
    () => ({
      goToPreviousMonth: () => {
        setCurrentMonth((prevMonth) => 
          new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1)
        );
      },
      goToNextMonth: () => {
        setCurrentMonth((prevMonth) => 
          new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1)
        );
      },
    }),
    []
  );

  const formattedMonth = useMemo(
    () => formatMonthYear(currentMonth),
    [currentMonth]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Previous Shifts</CardTitle>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={monthNavigation.goToPreviousMonth}
            className="flex items-center justify-center w-8 sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline sm:ml-2">Previous</span>
          </Button>

          <h3 className="text-lg font-semibold">{formattedMonth}</h3>

          <Button
            variant="outline"
            size="sm"
            onClick={monthNavigation.goToNextMonth}
            className="flex items-center justify-center w-8 sm:w-auto"
          >
            <span className="hidden sm:inline sm:mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {filteredShifts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Driver</TableHead>
                <TableHead className="text-right">Mileage (km)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.map((shift, index) => (
                <TableRow key={`${shift.date}-${shift.driver}-${index}`}>
                  <TableCell>
                    {formatDate(new Date(shift.date))}
 </TableCell>
                  <TableCell className="text-center">{shift.driver}</TableCell>
                  <TableCell className="text-right">{shift.mileage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No shifts found for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
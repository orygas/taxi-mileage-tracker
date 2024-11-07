import * as React from "react";
import { CalendarIcon, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Driver, ShiftData } from "@/types/types"; // Import the types

type MileageFormProps = {
  onSubmit: (data: ShiftData) => void;
  baseMileage: number;
};

export function MileageForm({ onSubmit, baseMileage }: MileageFormProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [driver, setDriver] = React.useState<Driver>("Oskar");
  const [endMileage, setEndMileage] = React.useState("");
  const [dateError, setDateError] = React.useState(false);
  const [mileageError, setMileageError] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setDateError(true);
      return;
    }
    setDateError(false);

    const endMileageNum = parseInt(endMileage);

    if (isNaN(endMileageNum) || endMileageNum <= baseMileage) {
      setMileageError(true);
      return;
    }
    setMileageError(false);

    const mileage = endMileageNum - baseMileage;
    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      driver,
      mileage,
      endMileage: endMileageNum,
    });
    setDate(undefined);
    setEndMileage("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Enter Shift Data</CardTitle>
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild className="transition-none">
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal hover:border-ring hover:bg-background",
                      !date && dateError && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd.MM.yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setDateError(false);
                      setIsCalendarOpen(false); // Close the calendar when a date is selected
                    }}
                    initialFocus
                    weekStartsOn={1}
                  />
                </PopoverContent>
              </Popover>
              {dateError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a date.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Driver</label>
              <Select
                value={driver}
                onValueChange={(value: Driver) => setDriver(value)}
              >
                <SelectTrigger className="w-full hover:border-ring">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oskar">Oskar</SelectItem>
                  <SelectItem value="Mateusz">Mateusz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">End of Shift Mileage</label>
            <Input
              type="tel"
              placeholder="Enter mileage"
              value={endMileage}
              onChange={(e) => {
                setEndMileage(e.target.value);
                setMileageError(false);
              }}
              className={cn(
                "w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-shadow duration-200 hover:border-ring",
                mileageError && "border-red-500"
              )}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            {mileageError && (
              <p className="text-red-500 text-sm mt-1">
                End mileage must be greater than the current mileage.
              </p>
            )}
          </div>
          <Button type="submit" className="w-full mt-4">
            Submit Shift Data
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
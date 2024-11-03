import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

type Driver = "Oskar" | "Mateusz";

type MileageFormProps = {
  onSubmit: (data: {
    date: string;
    driver: Driver;
    mileage: number;
    endMileage: number;
  }) => void;
  baseMileage: number;
};

export function MileageForm({ onSubmit, baseMileage }: MileageFormProps) {
  const [date, setDate] = useState<Date>();
  const [driver, setDriver] = useState<Driver>("Oskar");
  const [endMileage, setEndMileage] = useState("");
  const [open, setOpen] = useState(false);
  const [dateError, setDateError] = useState(false); // State for date error
  const [mileageError, setMileageError] = useState(false); // State for mileage error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Date validation
    if (!date) {
      setDateError(true);
      return;
    }
    setDateError(false);

    const endMileageNum = parseInt(endMileage);

    // Mileage validation
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

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
    setDateError(false);
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndMileage(e.target.value);
    setMileageError(false); // Clear error when user starts typing again
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                dateError && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
              weekStartsOn={1}
            />
          </PopoverContent>
        </Popover>
        {dateError && (
          <p className="text-red-500 text-sm mt-1">Please select a date.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver">Driver</Label>
        <Select
          value={driver}
          onValueChange={(value: Driver) => setDriver(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select driver" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Oskar">Oskar</SelectItem>
            <SelectItem value="Mateusz">Mateusz</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endMileage">End of Shift Mileage</Label>
        <Input
          id="endMileage"
          type="number"
          value={endMileage}
          onChange={handleMileageChange}
          required
          className={cn(mileageError && "border-red-500")}
        />
        {mileageError && (
          <p className="text-red-500 text-sm mt-1">
            End mileage must be greater than the current mileage.
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Current car mileage: {baseMileage} km
        </p>
      </div>

      <Button type="submit" className="w-full mt-4">
        Submit
      </Button>
    </form>
  );
}

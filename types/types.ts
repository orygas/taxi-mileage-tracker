export type Driver = "Oskar" | "Mateusz";

export interface ShiftData {
  date: string;
  driver: Driver;
  mileage: number;
  endMileage: number;
}

export interface MileageStats {
  weekly: Record<Driver, number>;
  monthly: Record<Driver, number>;
  totalWeekly: number;
  totalMonthly: number;
}
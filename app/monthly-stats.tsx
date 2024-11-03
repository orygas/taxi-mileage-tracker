import { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { format } from 'date-fns'

type Driver = 'Oskar' | 'Mateusz'
type ShiftData = {
  date: string
  driver: Driver
  mileage: number
  endMileage: number
}

type MonthlyStatsProps = {
  shiftData: ShiftData[]
  monthlyLimit: number
}

type MonthlyTotals = {
  [key in Driver]: number
}

export function MonthlyStats({ shiftData, monthlyLimit }: MonthlyStatsProps) {
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotals>({
    Oskar: 0,
    Mateusz: 0
  })
  const [totalMileage, setTotalMileage] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [monthLabel, setMonthLabel] = useState('')

  useEffect(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    setMonthLabel(format(startOfMonth, 'MMMM yyyy'))

    const totals = shiftData
      .filter(shift => {
        const shiftDate = new Date(shift.date)
        return shiftDate >= startOfMonth
      })
      .reduce((acc, shift) => {
        acc[shift.driver] = (acc[shift.driver] || 0) + shift.mileage
        return acc
      }, { Oskar: 0, Mateusz: 0 } as MonthlyTotals)

    const total = totals.Oskar + totals.Mateusz
    const percentage = (total / monthlyLimit) * 100

    setMonthlyTotals(totals)
    setTotalMileage(total)
    setProgressPercentage(percentage)
  }, [shiftData, monthlyLimit])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-2">Limit: {monthlyLimit} km</p><p className="text-sm text-gray-600 mb-2">Month: {monthLabel}</p>
      </div>
      
      <h3 className="text-lg font-semibold">Kilometers driven this month:</h3>
      <ul className="list-disc pl-5">
        <li>Oskar: {monthlyTotals.Oskar} km</li>
        <li>Mateusz: {monthlyTotals.Mateusz} km</li>
        <li className="font-semibold mt-2">Total: {totalMileage} km</li>
      </ul>
      <div className="mt-4">
        <Progress value={progressPercentage} className="w-full" />
        <p className="text-sm text-gray-600 mt-1">
          {progressPercentage.toFixed(1)}% of monthly limit
        </p>
      </div>
    </div>
  )
}

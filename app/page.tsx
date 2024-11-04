import React from "react";
import TaxiMileageTracker from "../components/main-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taxi Mileage Tracker",
};

export default function page() {
  return <TaxiMileageTracker></TaxiMileageTracker>;
}

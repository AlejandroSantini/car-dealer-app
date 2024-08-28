"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Home = () => {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json");
        const data = await response.json();
        setMakes(data.Results);
      } catch (error) {
        console.error("Error fetching makes:", error);
      }
    };

    fetchMakes();
  }, []);

  useEffect(() => {
    setIsButtonDisabled(!(selectedMake && selectedYear));
  }, [selectedMake, selectedYear]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

  const uniqueMakes = Array.from(
    new Map(makes.map(make => [make.VehicleTypeName, make])).values()
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Car Dealer Filter</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            id="make"
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="mt-1 block w-full border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select a make</option>
            {uniqueMakes.map((make) => (
              <option key={make.VehicleTypeId} value={make.VehicleTypeId}>
                {make.VehicleTypeName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Model Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="mt-1 block w-full border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select a year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <Link href={`/result/${selectedMake}/${selectedYear}`} passHref>
          <button
            disabled={isButtonDisabled}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
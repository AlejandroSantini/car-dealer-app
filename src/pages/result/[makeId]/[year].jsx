import { useRouter } from "next/router";
import { useEffect, useState, Suspense } from "react";

export async function getStaticPaths() {
  const makes = []; // Reemplazar con la lógica para obtener los ID de los fabricantes
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

  const paths = makes.flatMap(make =>
    years.map(year => ({
      params: { makeId: make.MakeId.toString(), year: year.toString() },
    }))
  );

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { makeId, year } = params;
  const fetchVehicleModels = async () => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
      const data = await response.json();
      console.log("Vehicle models fetched:", response);
      return data.Results || [];
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
      return [];
    }
  };

  const vehicles = await fetchVehicleModels();

  return {
    props: {
      vehicles,
      makeId,
      year,
    },
  };
}

const ResultPage = ({ vehicles, makeId, year }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicle Models</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Make ID: {makeId}, Year: {year}</h2>
        {console.log(vehicles)}
        {vehicles.length > 0 ? (
          <ul>
            {vehicles.map((vehicle) => (
              <li key={vehicle.ModelId} className="mb-2">
                {vehicle.ModelName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No vehicles found for the selected make and year.</p>
        )}
      </div>
    </div>
  );
};

export default function Page(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultPage {...props} />
    </Suspense>
  );
}

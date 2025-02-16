import axios from "axios";

const API_BASE_URL = "https://sky-scrapper.p.rapidapi.com";
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
    },
});

// For searching for flights
export const searchFlights = async (from, to, departureDate, returnDate) => {
    const fromEntityIds = await getOriginEntityIds(from);
    const toEntityIds = await getOriginEntityIds(to);

    try {
        console.log("Fetching flights for:", {
            from,
            to,
            fromEntityIds,
            toEntityIds,
            departureDate,
            returnDate,
        });

        const flightPromises = [];

        for (const fromEntity of fromEntityIds) {
            for (const toEntity of toEntityIds) {
                flightPromises.push(
                    apiClient.get("/api/v2/flights/searchFlights", {
                        params: {
                            originSkyId: fromEntity.skyId,
                            destinationSkyId: toEntity.skyId,
                            originEntityId: fromEntity.entityId,
                            destinationEntityId: toEntity.entityId,
                            date: departureDate,
                        },
                    })
                );
            }
        }

        const responses = await Promise.all(flightPromises);

        // Combine results from all requests
        const flightResults = responses.map((res) => res.data).flat();

        console.log("All Flight Results:", flightResults);
        return flightResults;
    } catch (error) {
        console.error(
            "Error fetching flight data:",
            error.response ? error.response.data : error.message
        );
        return null;
    }
};

// For searching for airports
export const searchAirport = async (query) => {
    try {
        const response = await apiClient.get("/api/v1/flights/searchAirport", {
            params: { query }, // e.g. NYC or New York
        });

        console.log("Airport Data:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching airport data:",
            error.response ? error.response.data : error.message
        );
        return null;
    }
};

// To get the entityIds for airports
export const getOriginEntityIds = async (airportCode) => {
    const airports = await searchAirport(airportCode);

    if (airports && airports.data.length > 0) {
        return airports.data.map((airport) => ({
            entityId: airport.entityId,
            name: airport.presentation.title,
            skyId: airport.skyId,
        }));
    }
    return [];
};

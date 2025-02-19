import React, { useState } from "react";
import { searchFlights } from "../../api/flightApi";
import styles from "./Home.module.css";

const Home = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        departureDate: "",
        returnDate: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const flightResults = await searchFlights(
                formData.from,
                formData.to,
                formData.departureDate,
                formData.returnDate
            );
            setFlights(flightResults || []);
        } catch (err) {
            setError("Failed to fetch flights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDepartureDateChange = (e) => {
        setFormData({
            ...formData,
            departureDate: e.target.value,
        });
        if (new Date(e.target.value) > new Date(formData.returnDate)) {
            setFormData({
                ...formData,
                returnDate: e.target.value,
            });
        }
    };

    const handleReturnDateChange = (e) => {
        setFormData({
            ...formData,
            returnDate: e.target.value,
        });
    };

    return (
        <div className={styles.homeContainer}>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="from"
                    placeholder="From"
                    value={formData.from}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="to"
                    placeholder="To"
                    value={formData.to}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleDepartureDateChange}
                    required
                />
                <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleReturnDateChange}
                    min={formData.departureDate}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search Flights"}
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.results}>
                {flights.map((flight, index) => {
                    if (
                        !flight.data ||
                        !flight.data.itineraries ||
                        !flight.data.itineraries[index]
                    ) {
                        <p>No flights found.</p>;
                        return null;
                    }

                    const { price, legs } = flight.data.itineraries[index];

                    return (
                        <div key={index} className={styles.flightCard}>
                            <div className={styles.legDetails}>
                                {legs?.map((leg, legIndex) => (
                                    <div key={legIndex}>
                                        <p>
                                            <strong>From:</strong>{" "}
                                            {leg.origin.name} (
                                            {leg.origin.displayCode})
                                        </p>
                                        <p>
                                            <strong>To:</strong>{" "}
                                            {leg.destination.name} (
                                            {leg.destination.displayCode})
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.flightDetails}>
                                {legs?.map((leg, legIndex) => (
                                    <div key={legIndex}>
                                        <p>
                                            <strong>Departure:</strong>{" "}
                                            {new Date(
                                                leg.departure
                                            ).toLocaleString()}
                                        </p>
                                        <p>
                                            <strong>Arrival:</strong>{" "}
                                            {new Date(
                                                leg.arrival
                                            ).toLocaleString()}
                                        </p>
                                        <p>
                                            <strong>Duration:</strong>{" "}
                                            {Math.floor(
                                                leg.durationInMinutes / 60
                                            )}
                                            h {leg.durationInMinutes % 60}m
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.price}>
                                <p>Price: ${price?.raw}</p>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => alert("Order placed!")}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/ai/films");
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);

      // Retry logic
      if (retrying) {
        setTimeout(fetchMovies, 5000);
      }
    }
  };

  const startRetrying = () => {
    setRetrying(true);
    fetchMovies();
  };

  const stopRetrying = () => {
    setRetrying(false);
  };

  useEffect(() => {
    if (retrying) {
      fetchMovies();
    }
  }, [retrying]);

  return (
    <>
      <section>
        <button style={{ margin: "1rem" }} onClick={startRetrying}>
          Fetch Movies
        </button>
        {retrying && <button onClick={stopRetrying}>Cancel</button>}
      </section>
      <section>
        {!isLoading && error && (
          <p>
            Error: {error} {retrying ? "Retrying..." : ""}
          </p>
        )}
        {!isLoading && !error && movies.length > 0 && (
          <MoviesList movies={movies} />
        )}
        {!isLoading && !error && movies.length === 0 && <p>Found no movies!</p>}
        {isLoading && <p>Loading data...</p>}
      </section>
    </>
  );
};

export default App;

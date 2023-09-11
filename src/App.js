import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films");
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
        setTimeout(fetchMoviesHandler, 5000);
      }
    }
  });
  
  useEffect(()=> {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const startRetrying = () => {
    setRetrying(true);
    fetchMoviesHandler();
  };

  const stopRetrying = () => {
    setRetrying(false);
  };

  useEffect(() => {
    if (retrying) {
      fetchMoviesHandler();
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
            Error: {error} {retrying ? "!Retrying..." : ""}
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

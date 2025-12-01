import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import TrailerModal from "./components/TrailerModal.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

// 1. Import Toaster and toast
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
      // Optional: Toast for general errors too
      toast.error("Could not load movies");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movieId}/videos?language=en-US`,
        API_OPTIONS
      );

      if (!response.ok) throw new Error("Failed to fetch trailer");

      const data = await response.json();

      const trailer = data.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );

      if (trailer) {
        setSelectedVideoKey(trailer.key);
        setIsModalOpen(true);
      } else {
        const anyYoutubeVideo = data.results.find(
          (video) => video.site === "YouTube"
        );
        if (anyYoutubeVideo) {
          setSelectedVideoKey(anyYoutubeVideo.key);
          setIsModalOpen(true);
        } else {
          // 2. REPLACED ALERT WITH TOAST
          toast.error("No trailer available for this movie", {
            icon: "🎬",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      toast.error("Failed to fetch trailer info");
    }
  };

  const closeTrailer = () => {
    setIsModalOpen(false);
    setSelectedVideoKey(null);
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      {/* 3. Add the Toaster Component (Global configuration) */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          // Define default styles to match your dark theme
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #333",
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // Red error color
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies?.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => fetchMovieTrailer(movie.id)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <TrailerModal
        videoKey={selectedVideoKey}
        isOpen={isModalOpen}
        onClose={closeTrailer}
      />
    </main>
  );
};

export default App;

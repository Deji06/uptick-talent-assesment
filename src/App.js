import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import MovieList from "./component/MovieList";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

function App() {
  const [changeWidth, setchangeWidth] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedMovie, setSearchedMovie] = useState([]);
  const [displayByGenre, setDisplayByGenre] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [genreChecker, setGenreChecker] = useState("");
  const [searchMoviesFrom, setSearchMoviesFrom] = useState("");
  const [searchMoviesTo, setSearchMoviesTo] = useState("");
  const [displayMenu, setDisplayMenu] = useState(false);

  // search function
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (input.trim().length > 0) {
        searchResult(input);
      } else {
        setSearchedMovie([]);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [input]);

  const searchResult = async (query) => {
    setLoading(true);
    setError(null);
    const url = "https://api.themoviedb.org/3/search/movie";
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    try {
      const response = await axios.get(url, {
        params: {
          api_key: API_KEY,
          query: query,
          page: 1,
          language: "en-US",
        },
      });
      const data = response.data.results;
      setSearchedMovie(data);
      // setInput(searchedMovie)
      // console.log("search result", data);
    } catch (error) {
      console.error("error fetching search result", error);
      setError("Failed to fetch movie");
      setSearchedMovie([]);
    } finally {
      setLoading(false);
    }
  };

  // filtering function
  useEffect(() => {
    let moviesToRender = [];
    const filteredMovies = movieList.filter((filteredMovies) => {
      if (!genreChecker || genreChecker === "Genre") {
        return true;
      }
      // converting movielist genre id to generic genretype object
      const movieGenreNames = filteredMovies.genre_ids.map(
        (id) => genreType[id]
      );
      // console.log("filterresult", movieGenreNames);
      return movieGenreNames.includes(genreChecker);
    });

    if (input.trim().length > 0) {
      moviesToRender = searchedMovie;
    } else {
      moviesToRender = filteredMovies;
    }
    // console.log("filteredmoviesdata:", filteredMovies);
    setDisplayByGenre(moviesToRender);
  }, [genreChecker, movieList, searchedMovie, input]);

  // popular movies display
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchMovieList = async () => {
      const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const url = "https://api.themoviedb.org/3/movie/popular";
        const res = await axios.get(url, {
          params: {
            api_key: API_KEY,
            language: "en-US",
            page: 1,
          },
        });
        setMovieList(res.data.results);
        // console.log("fetched data:", res.data.results);
      } catch (error) {
        console.log("error fetching movies...", error);
      }
    };
    fetchMovieList();
  }, []);

  // sort movies by date
  useEffect(() => {
    const sortMoviesByDate = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = "https://api.themoviedb.org/3/discover/movie";
        const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const params = {
          api_key: API_KEY,
          language: "en-US",
          page: 1,
          sort_by: "popularity.desc",
        };
        if (searchMoviesFrom) {
          params["primary_release_date.gte"] = searchMoviesFrom;
        }
        if (searchMoviesTo) {
          params["primary_release_date.lte"] = searchMoviesTo;
        }

        const res = await axios.get(url, { params });
        setMovieList(res.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
    sortMoviesByDate();
  }, [searchMoviesFrom, searchMoviesTo]);

  // generic genretype
  const genreType = {
    27: "Horror",
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10752: "War",
    14: "Fantasy",
    36: "History",
    10402: "Music",
    53: "Thriller",
    37: "Western",
    10770: "Tv Movie",
    878: "Science Fiction",
    9648: "Mistery",
    10749: "Romance",
  };

  const handleForm = (e) => {
    e.preventDefault();
    // setInput("");
  };

  // handle hamburgger

  const handleUserInput = (e) => {
    setInput(e.target.value);
    // console.log(input);
  };
  return (
    <>
      <div className="flex sm:flex-row flex-col gap-y-5 justify-between sm:items-center pt-10">
        <div className="flex justify-between items-center">
          <div className="text-white sm:px-5 text-[30px] ml-5 uppercase">
            movie <span className="text-red-900">app</span>{" "}
          </div>
          <GiHamburgerMenu
            onClick={() => setDisplayMenu(!displayMenu)}
            className="text-red-900 text-[30px] mr-5 sm:hidden"
          />
        </div>
        {/* display on small screen */}
        {displayMenu && (
          <form
            action=""
            onSubmit={handleForm}
            className={` transition-all duration-300 border-2 w-[80%] ml-5 ${
              changeWidth ? "sm:w-[60%] && border-red-900" : "sm:w-[20%]"
            } mr-10 rounded sm:hidden`}
          >
            <div className="flex items-center gap-x-2 py-1 border-none  bg-white rounded ">
              <FaSearch className="text-[20px] mx-4 bg-white text-[#CCCDDE] " />
              <input
                value={input}
                onChange={handleUserInput}
                type="text"
                placeholder="search"
                className="w-full  outline-none border-none"
                onFocus={() => setchangeWidth(!changeWidth)}
                onBlur={() => setchangeWidth(false)}
              />
            </div>
          </form>
        )}
        {/* big screen display */}
        <form
          action=""
          onSubmit={handleForm}
          className={` transition-all duration-300 border-2 bg-white  ml-5 ${
            changeWidth ? "sm:w-[60%] && border-red-900" : "sm:w-[20%]"
          } mr-10 rounded hidden sm:flex`}
        >
          <div className="flex items-center gap-x-2 py-1 border-none  bg-white rounded ">
            <FaSearch className="text-[20px] mx-4 bg-white text-[#CCCDDE] " />
            <input
              value={input}
              onChange={handleUserInput}
              type="text"
              placeholder="search"
              className="w-full  outline-none border-none"
              onFocus={() => setchangeWidth(!changeWidth)}
              onBlur={() => setchangeWidth(false)}
            />
          </div>
        </form>
      </div>
      <MovieList
        // setSearchedMovie={setSearchedMovie}
        // searchedMovie={searchedMovie}
        displayMenu={displayMenu}
        displayByGenre={displayByGenre}
        setDisplayByGenre={setDisplayByGenre}
        loading={loading}
        error={error}
        input={input}
        genreType={genreType}
        setGenreChecker={setGenreChecker}
        searchMoviesFrom={searchMoviesFrom}
        searchMoviesTo={searchMoviesTo}
        setSearchMoviesFrom={setSearchMoviesFrom}
        setSearchMoviesTo={setSearchMoviesTo}
      />
    </>
  );
}

export default App;

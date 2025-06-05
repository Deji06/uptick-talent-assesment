import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from 'lucide-react';

const MovieList = ({
  // setSearchedMovie,
  genreType,
  // searchedMovie,
  loading,
  error,
  input,
  // setDisplayByGenre,
  displayByGenre,
  displayMenu,
  // setMovieList,
  setGenreChecker,
  genreChecker,
  setSearchMoviesFrom,
  setSearchMoviesTo,
  searchMoviesFrom,
  searchMoviesTo,
}) => {
  const [genre, setGenre] = useState([]);
  useEffect(() => {
    const getGenryCategory = async () => {
      const url = "https://api.themoviedb.org/3/genre/movie/list";
      const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
      try {
        const res = await axios.get(url, {
          params: {
            api_key: API_KEY,
            language: "en-US",
          },
        });
        setGenre(res.data.genres);
        setGenreChecker(res.data.genres.name);
        // console.log("selected genre:", res.data.genres.name);

        // console.log("genre data:", res.data);
      } catch (error) {
        console.log("error fetching genre:", error);
      }
    };
    getGenryCategory();
  }, []);
  // const[displayByGenre, setDisplayByGenre] = useState([])

  if (loading) {
    return (
     <div className="flex justify-center items-center h-48 text-red-900">
        <LoaderCircle className="animate-spin text-red-600" size={48} /> 
        <p className="ml-3 text-lg text-red-900">Loading movies...</p> 
      </div>
    );
  }
  if (error) {
    return <p className="text-red-900 flex justify-center mt-10">Error: {error}</p>;
  }

  // Handle case where no movies are found after filtering/searching
  // if (displayByGenre.length === 0) {
  //   return (
  //     <p className="text-red-900 flex justify-center mt-20 text-[20px]">
  //      Sorry!! No movies with such title.....
  //     </p>
  //   );
  // }

  const handleGenre = (e) => {
    setGenreChecker(e.target.value);
    // console.log(e.target.value);
  };

  return (
    <div className="mx-5 sm:mt-5 h-auto">
      {/* mobile display */}
      {displayMenu && (
        <div className="flex sm:flex-row flex-col sm:items-center justify-between transition-all duration-300 sm:hidden">
          <div className="flex items-center gap-x-5 mt-5">
            <p className="sm:px-5 text-white sm:text-[30px] text-[20px]">
              latest releases
            </p>
            {/* genre options */}
            <select
              name="GENRE"
              id=""
              value={genreChecker}
              className="bg-black w-[20%] text-red-900 text-[20px] border-none outline-none "
              onChange={handleGenre}
            >
              <option value="" selected className="text-gray-400">
                Genre
              </option>
              {genre.map((genreItem) => (
                <option
                  key={genreItem.id}
                  value={genreItem.name}
                  className="text-white flex flex-col cursor-pointer"
                >
                  {genreItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex  gap-x-2 mr-5 mt-5 sm:mt-0">
            <div className="flex items-center space-x-2">
              <label htmlFor="" className="text-red-900">
                From:
              </label>
              <input
                type="date"
                value={searchMoviesFrom}
                onChange={(e) => setSearchMoviesFrom(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="" className="text-red-900">
                To:
              </label>
              <input
                type="date"
                value={searchMoviesTo}
                onChange={(e) => setSearchMoviesTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      {/* big screen display */}
      <div className="sm:flex-row flex-col sm:items-center justify-between transition-all duration-300 hidden sm:flex">
        <div className="flex items-center gap-x-5 mt-5">
          <p className="sm:px-5 text-white sm:text-[30px] text-[20px]">
            latest releases
          </p>
          {/* genre options */}
          <select
            name="GENRE"
            id=""
            value={genreChecker}
            className="bg-black w-[20%] text-red-900 text-[20px] border-none outline-none "
            onChange={handleGenre}
          >
            <option value="" selected className="text-gray-400">
              Genre
            </option>
            {genre.map((genreItem) => (
              <option
                key={genreItem.id}
                value={genreItem.name}
                className="text-white flex flex-col cursor-pointer"
              >
                {genreItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex  gap-x-2 mr-5 mt-5 sm:mt-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="" className="text-red-900">
              From:
            </label>
            <input
              type="date"
              value={searchMoviesFrom}
              onChange={(e) => setSearchMoviesFrom(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="" className="text-red-900">
              To:
            </label>
            <input
              type="date"
              value={searchMoviesTo}
              onChange={(e) => setSearchMoviesTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* movie Lisst */}
      <div className="grid sm:grid-cols-3 gap-x-3 gap-y-5 pb-10 mt-10 sm:mt5">
        {displayByGenre.map((movie) => (
          <div key={movie.id} className="w-fit px-5 space-y-3">
            <img
              className="w-[100%] text-red-900"
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt="movie jpg"
            />
            <h2 className="text-white text-[20px]">
              <span className="text-red-900 text-[15px]">Title: </span>
              {movie.title}
            </h2>
            <p className="text-white ">
              {" "}
              <span className="text-red-900">Release date:</span>{" "}
              {movie.release_date}
            </p>
            <h2 className="text-red-900 w-fit text-[13px]">{movie.overview}</h2>
            <p className="text-white">
              <span className="text-red-900">Genre:</span>{" "}
              {movie.genre_ids.map((id) => genreType[id]).join(", ")}
            </p>
          </div>
        ))}
      </div>
      {displayByGenre.length === 0 && genreChecker !== "Genre" && (
        <p className="text-red-900 flex justify-center text-[30px]">
          sorry!! no movies to display....
        </p>
      )}
    </div>
  );
};

export default MovieList;

import { useState, useEffect } from 'react'
import Search from './components/Search'
import Loader from './components/Loader';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
// API - Application Programming Interface - a set of rules that allows one software application to talk to another
// Api base url
const API_BASE_URL = 'https://api.themoviedb.org/3';

// API key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Api options 
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  // state to search using props || not to mutate the state mannually by allocating a value but by using setter function
  const [searchTerm, setSearchTerm] = useState('');

  // state to define error message
  const [errorMessage, setErrorMessage] = useState('')
  // state to define list of movie
  const [movieList, setMovieList] = useState([])
  // state to define loading of data value
  const [isLoading, setIsLoading] = useState(false)
  // state to debounce a search input
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  // state to get value of trending movies
  const [trendingMovies, setTrendingMovies] = useState([])

// defining a hook for debouncing which debounce the search term to prevent making too many API requests like rate limiting for usage
// by waiting for user to stop typing for 500ms
useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  // function to fetch movie data
  const fetchMovies = async (query = "") => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      // defining endpoint of api and condition to check for query of list and update it | encode uri to make it secure and fully function
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      // to fetch a data from api
      const response = await fetch(endpoint, API_OPTIONS);
      // parse to json object to get value
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      // response from fetched data and set a value to display
      if(data.Response === 'False') {
        setErrorMessage(data.error || 'failed to fetch movies')
        setMovieList([])
        return;
      }

      setMovieList(data.results || [])

      // to update search count and enable db to store search
      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      // set error message value to display
      setErrorMessage('Error fetching movies. Please try again later')
    } finally{
      setIsLoading(false)
    }
  }

  // function to load trendy movies list
  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies()

      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error Fetching trending Movies: ${error}`);
      
    }
  }

  // only load at start with its dependencies
  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm]);//the dependencies is defined to update and fetched a movies list

  // to load trndy movies only load at start
  useEffect(() => {
    loadTrendingMovies()
  }, [])
  return (
    <main>
      <div className='pattern'>
        <div className="wrapper">
          <header>
            <img src='./hero.png' alt='Hero banner'></img>
            <h1 className=''>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <h1>{searchTerm}</h1>

          {trendingMovies.length > 0 && (
            <section className="trending-section mt-16 px-5 sm:px-10 max-w-7xl mx-auto">
              {/* Section Title */}
              <h2 className="text-white text-3xl sm:text-4xl font-bold mb-10">
                🔥 Trending Movies
              </h2>

              {/* Grid Layout: 5 per row on large screens */}
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingMovies.map((movie, index) => (
                  <li
                    key={movie.$id}
                    className="relative flex items-center group"
                  >
                    {/* Large Rank Number */}
                    <span className="text-[64px] sm:text-[80px] font-extrabold text-light-100/20 leading-none tracking-tighter mr-3 -ml-1">
                      {index + 1}
                    </span>

                    {/* Poster */}
                    <div className="relative w-[127px] h-[163px] sm:w-[140px] sm:h-[200px] lg:w-[160px] lg:h-[220px] overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>


          )}

          <section className='all-movies'>
            <h2 className='mt-[40px]'>All Movies</h2>
            {isLoading ? (
              <Loader/>
            ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  // defining a props to fetch a value using component
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )

            }
            
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
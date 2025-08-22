import { useState, useEffect } from 'react'
import Search from './components/Search'
import Loader from './components/Loader';
import MovieCard from './components/MovieCard';
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

  // function to fetch movie data
  const fetchMovies = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      // defining endpoint of api
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      // set error message value to display
      setErrorMessage('Error fetching movies. Please try again later')
    } finally{
      setIsLoading(false)
    }
  }

  // only load at start with its dependencies
  useEffect(() => {
    fetchMovies()
  }, []);

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
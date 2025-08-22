import React from 'react'
// destructuring props 
const MovieCard = ({movie: {title, vote_average, poster_path, original_language, release_date}}) => {
  return (
    
    <div className='movie-card-container'>

        <div className="movie-card">

          <img
              src={poster_path ?
                  `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
              alt={title}
          />

          <div className="mt-4">
            <h3>{title}</h3>

                  <div className="content flex items-center gap-2 p-3">
                      <div
                          className="rating flex items-center gap-1.5 px-2 py-1.5 bg-yellow-500/20 rounded-md"
                          title={vote_average ? `Rating: ${vote_average.toFixed(1)}` : 'Rating not available'}
                      >
                          <img
                              className="w-4 h-4"
                              src="star.svg"
                              alt="Star Icon"
                              loading="lazy"
                          />
                          <p className="text-white text-sm font-medium">
                              {vote_average ? vote_average.toFixed(1) : 'N/A'}
                          </p>
                      </div>
                      <span className="text-white text-sm">•</span>
                      <p className="text-white">{original_language}</p>
                      <span className="text-white text-sm">•</span>
                      <div className='year text-white'>
                        {release_date ? release_date.split('-')[0]: 'N/A'}
                      </div>
                  </div>

          </div>
      </div>
    </div>
  )
}

export default MovieCard
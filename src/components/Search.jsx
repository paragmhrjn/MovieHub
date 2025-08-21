import React from 'react'
// 'destructing props' not to mutate props || props are read only
const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className='search'>
            <div>

                <img src="search.svg" alt="search" />
                <input type="text"
                    placeholder='Search through thousands of movies'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    )
}

export default Search
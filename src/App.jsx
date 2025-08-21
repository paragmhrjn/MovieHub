import React, { useState } from 'react'
import Search from './components/Search'

const App = () => {
  // state to search using props || not to mutate the state mannually by allocating a value but by using setter function
  const[searchTerm, setSearchTerm] = useState('');
  return (
    <main>
      <div className='pattern'>
        <div className="wrapper">
          <header>
            <img src='./hero.png' alt='Hero banner'></img>
            <h1 className=''>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          <h1>{searchTerm}</h1>
        </div>
      </div>
    </main>
  )
}

export default App
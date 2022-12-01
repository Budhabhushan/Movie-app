import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const featchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://react-http-6e896-default-rtdb.firebaseio.com/movies.json");
      if(!response.ok) {
        throw new Error('Somthing Went Wrong....!')
       }

      const data = await response.json();
      
      const loadedMovies = []

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate:data[key].releaseDate
        })
      }
      // const transformedData = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false);
  },[])

  useEffect(()=> {
    featchMovieHandler()
  },[featchMovieHandler])

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-6e896-default-rtdb.firebaseio.com/movies.json',{
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
  }

  let content = <p>Found No Movies.</p>
  if(movies.length > 0) {
   content = <MoviesList movies={movies} />
  }

  if(error) {
    content = error
  }

  if(isLoading){
   content = <p>Loading!.......</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie  onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={featchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
       {content}
      </section>
    </React.Fragment>
  );
}

export default App;

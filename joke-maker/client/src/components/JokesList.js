import { useEffect, useState } from 'react';
import JokeCard from './JokeCard';

export default function JokesList() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    async function fetchJokes() {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'jokes');
      const json = await response.json();

      setJokes(json.jokes.map((joke) => {
        return { ...joke, isEdit: false };
      }));
    }

    fetchJokes();
  }, []);

  function swapIsEdit(title) {
    setJokes(jokes.map((joke) => {
      if (joke.title !== title) {
        return joke;
      }

      return { ...joke, isEdit: !joke.isEdit };
    }));
  }

  async function updateJoke(event, oldTitle, updatedJoke, file) {
    event.preventDefault();
    const oldJoke = jokes.find((joke) => joke.title === oldTitle);
    const newJoke = { ...oldJoke, title: updatedJoke.title, joke: updatedJoke.joke, isEdit: false };
    const formToSend = new FormData();
    formToSend.append('jokeFields', JSON.stringify({ title: newJoke.title, joke: newJoke.joke }));

    if (file) {
      formToSend.append('file', file);
    }

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'jokes/' + oldJoke.title, {
      method: 'PUT',
      headers: {},
      body: formToSend
    });

    if (response.status === 200) {
      const jokeFromBackend = await response.json();

      setJokes(jokes.map((joke) => {
        if (joke.title !== oldJoke.title) {
          return joke;
        }

        return { ...newJoke, title: jokeFromBackend.title, joke: jokeFromBackend.joke, url: jokeFromBackend.url };
      }));
    }
  }

  function deleteJoke(title) {
    setJokes(jokes.filter((joke) => joke.title !== title));
  }

  let jokeCards = [];

  if (jokes) {
    jokeCards = jokes.map((joke) => {
      return <JokeCard key={joke.url} title={joke.title} jokeText={joke.joke} url={process.env.REACT_APP_BACKEND_URL + joke.url} deleteJoke={deleteJoke} isEdit={joke.isEdit} swapIsEdit={swapIsEdit} updateJoke={updateJoke} />
    });
  }

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {jokeCards}
      </div>
    </div>
  );
}

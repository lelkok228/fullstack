import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JokeCreate() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [jokeText, setJokeText] = useState('');

  function changeTitle(event) {
    setTitle(event.target.value);
  }

  function changeJokeText(event) {
    setJokeText(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formToSend = new FormData();
    formToSend.append('file', fileRef.current.files[0]);
    formToSend.append('jokeFields', JSON.stringify({ title, joke: jokeText }));

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'jokes', {
      method: 'POST',
      headers: {},
      body: formToSend
    });

    if (response.status === 200) {
      navigate('/');
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Описание..." value={title} onChange={changeTitle} />
        </div>

        <div className="input-group mb-3">
          <textarea className="form-control" placeholder="Анекдот..." value={jokeText} onChange={changeJokeText} />
        </div>

        <div className="input-group mb-3">
          <input type="file" ref={fileRef} className="form-control" />
        </div>

        <button type="submit" className="w-100 btn btn-primary btn-lg">Сохранить</button>
      </form>
    </div>
  );
}

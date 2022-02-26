import { useEffect, useRef, useState } from 'react';

export default function JokeCard(props) {
  const fileRef = useRef(null);

  const [title, setTitle] = useState('');
  const [jokeText, setJokeText] = useState('');

  useEffect(() => {
    setTitle(props.title);
    setJokeText(props.jokeText);
  }, [props.title, props.jokeText]);

  function changeTitle(event) {
    setTitle(event.target.value);
  }

  function changeJokeText(event) {
    setJokeText(event.target.value);
  }

  async function deleteJoke() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'jokes/' + props.title, {
      method: 'DELETE'
    });

    if (response.status === 200) {
      props.deleteJoke(props.title);
    }
  }

  function getFile() {
    if (fileRef && fileRef.current && fileRef.current.files[0]) {
      return fileRef.current.files[0];
    }

    return undefined;
  }

  return (
    <div className="col">
      <div className="card shadow-sm">
        <img hidden={props.isEdit} src={props.url} alt={props.title} style={{ maxWidth: '450px', maxHeight: '300px' }} />
        <div className="card-body">
          <p hidden={props.isEdit} className="card-text">{props.jokeText}</p>
          <div hidden={props.isEdit} className="d-flex justify-content-between align-items-center">
            <div hidden={props.isEdit} className="btn-group">
              <button type="button" onClick={() => props.swapIsEdit(props.title)} className="btn btn-sm mx-1 btn-outline-secondary">Отредактировать</button>
              <button type="button" onClick={deleteJoke} className="btn btn-sm mx-1 btn-outline-secondary">Удалить</button>
            </div>
          </div>

          <form hidden={!props.isEdit} onSubmit={(event) => props.updateJoke(event, props.title, { title, joke: jokeText }, getFile())}>
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
      </div>
    </div>
  );
}

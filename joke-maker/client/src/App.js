import { Route, Routes } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Contacts from './components/Contacts';
import Header from './components/Header';
import JokeCreate from './components/JokeCreate';
import JokesList from './components/JokesList';

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/jokes/new" element={<JokeCreate />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/" element={<JokesList />} />
      </Routes>
    </>
  );
}

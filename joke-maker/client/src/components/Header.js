import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <div className="container">
      <header className="d-flex justify-content-center py-3">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')} aria-current="page">
              Анекдоты
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/jokes/new" className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}>
              Добавить Новый
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}>
              Контакты
            </NavLink>
          </li>
        </ul>
      </header>
    </div>
  );
}

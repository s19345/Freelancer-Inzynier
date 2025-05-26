import React from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Header = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user = useSelector((state) => state.auth.user);

    return (
        <header style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem' }}>
                        <strong>MyApp</strong>
                    </Link>
                </div>

                <nav>
                    <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                        <li style={{ marginRight: '1rem' }}>
                            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
                                Dashboard
                            </Link>
                        </li>

                        {/* Je¶li u¿ytkownik nie jest zalogowany, pokazujemy opcje logowania i rejestracji */}
                        {!isLoggedIn ? (
                            <>
                                <li style={{ marginRight: '1rem' }}>
                                    <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
                                        Logowanie
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>
                                        Rejestracja
                                    </Link>
                                </li>
                            </>
                        ) : (
                            // Je¶li u¿ytkownik jest zalogowany, pokazujemy jego profil oraz opcjê wylogowania
                            <>
                                <li style={{ marginRight: '1rem' }}>
                                    <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>
                                        {user?.nickname || 'Profil'}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/logout" style={{ color: '#fff', textDecoration: 'none' }}>
                                        Wyloguj
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
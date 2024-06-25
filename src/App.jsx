
//ESTEEE FUNCIONA HASTA ACA BORRAR EN CASO DE FALLO

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importamos el archivo CSS para el diseño

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modelo, setModelo] = useState('');
    const [patente, setPatente] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [autos, setAutos] = useState([]);
    const [search, setSearch] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(true); // Variable para controlar la visualización del formulario de inicio de sesión

    useEffect(() => {
        if (loggedIn) {
            obtenerAutos();
        }
    }, [loggedIn]);

    useEffect(() => {
        obtenerAutos();
    }, [search]);

    useEffect(() => {
        setCurrentUser(localStorage.getItem('currentUser') || '');
    }, [loggedIn]);

    const obtenerAutos = async () => {
        try {
            const response = await axios.get('http://localhost:5001/autos');
            setAutos(response.data);
        } catch (error) {
            console.error('Error al obtener los autos:', error);
        }
    };

    const registrar = async () => {
        try {
            await axios.post('http://localhost:5001/registrar', { username, password });
            alert('Usuario registrado exitosamente');
            setShowLoginForm(true); // Después de registrarse, mostrar el formulario de inicio de sesión nuevamente
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5001/login', { username, password });
            if (response.data.message === 'Inicio de sesión exitoso') {
                setLoggedIn(true);
                localStorage.setItem('currentUser', username); // Guardar el nombre de usuario en el almacenamiento local
                setShowLoginForm(false); // Ocultar el formulario de inicio de sesión después de iniciar sesión
            } else {
                alert('Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    const logout = () => {
        setLoggedIn(false);
        localStorage.removeItem('currentUser'); // Eliminar el nombre de usuario del almacenamiento local al cerrar sesión
    };

    const agregarAuto = async () => {
        try {
            await axios.post('http://localhost:5001/agregarAuto', { modelo, patente });
            alert('Auto agregado exitosamente');
            obtenerAutos();
        } catch (error) {
            console.error('Error al agregar el auto:', error);
        }
    };

    const cobrar = async (id, precioPorHora) => {
        try {
            const response = await axios.post('http://localhost:5001/cobrar', { id });
            const duracion = (new Date(response.data.horaSalida) - new Date(response.data.horaIngreso)) / 1000 / 60 / 60; // horas
            const costo = duracion * precioPorHora;
            alert(`Costo total: $${costo.toFixed(2)}`);
            // Eliminar el auto de la lista después de cobrar
            setAutos(autos.filter(auto => auto._id !== id));
        } catch (error) {
            console.error('Error al cobrar:', error);
        }
    };

    return (
        <div>
            <div className="menu">
                {loggedIn && (
                    <>
                        <h1>Facturando como , {currentUser}</h1>
                        <button onClick={logout}className='boton'>Cerrar Sesión</button>
                    </>
                )}
            </div>
            {showLoginForm && ( // Mostrar el formulario de inicio de sesión si showLoginForm es verdadero
                <div className='login'>
                    <h2>Iniciar Sesión</h2>
                    <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br></br>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br></br>
                    <button onClick={login}>Iniciar Sesión</button>

                    <button onClick={() => setShowLoginForm(false)}>Registrar</button> {/* Botón para ir al formulario de registro */}
                </div>
            )}
            {!loggedIn && !showLoginForm && ( // Mostrar el formulario de registro si no estamos autenticados y showLoginForm es falso
                <div >
                    <h2>Registrar</h2>
                    <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br></br>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br></br>
                    <button onClick={registrar}>Registrar</button>
                    <button onClick={() => setShowLoginForm(true)}>Volver al inicio de sesión</button> {/* Botón para volver al formulario de inicio de sesión */}
                </div>
            )}
            {loggedIn && (
                <div>
                    <div className='Agregarauto'>
                    <h2>Agregar Vehículo
                    </h2>
                    <label id='letra'>Modelo</label>
                    <br></br>
                    <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                    <br></br>
                    <br></br>
                    <label id='letra'>Patente</label>
                    <br></br>
                    <input type="text" placeholder="Patente" value={patente} onChange={(e) => setPatente(e.target.value)} />
                    <br></br>
                    <br></br>
                    <button onClick={agregarAuto}>Agregar Vehículo
                    </button>
                    </div>
                    <br></br>
                    <h2>Buscar Vehículo
                    </h2>
                    <input type="text" placeholder="Buscar por modelo o patente" value={search} onChange={(e) => setSearch(e.target.value)} />

                    <h2>Autos</h2>
                    <div className="autos-grid">
                        {autos
                            .filter(
                                (auto) =>
                                    auto.modelo.toLowerCase().includes(search.toLowerCase()) ||
                                    auto.patente.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((auto) => (
                                <div key={auto._id} className="auto-card">
                                    <p>Modelo: {auto.modelo}</p>
                                    <p>Patente: {auto.patente}</p>
                                    <p>Hora de Ingreso: {new Date(auto.horaIngreso).toLocaleString()}</p>
                                    <input
                                        type="number"
                                        placeholder="Precio por hora"
                                        value={auto.precioPorHora}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setAutos(
                                                autos.map((a) => {
                                                    if (a._id === auto._id) {
                                                        return { ...a, precioPorHora: newValue };
                                                    }
                                                    return a;
                                                })
                                            );
                                        }}
                                    />
                                    <button onClick={() => cobrar(auto._id, auto.precioPorHora)}>Cobrar</button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;


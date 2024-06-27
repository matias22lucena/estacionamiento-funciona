import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modelo, setModelo] = useState('');
    const [patente, setPatente] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [autos, setAutos] = useState([]);
    const [search, setSearch] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(true);

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
            setShowLoginForm(true);
            // Limpiar los inputs
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5001/login', { username, password });
            if (response.data.message === 'Inicio de sesión exitoso') {
                setLoggedIn(true);
                localStorage.setItem('currentUser', username);
                setShowLoginForm(false);
                // Limpiar los inputs
                setUsername('');
                setPassword('');
            } else {
                alert('Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    const logout = () => {
        setLoggedIn(false);
        localStorage.removeItem('currentUser');
    };

    const agregarAuto = async () => {
        try {
            await axios.post('http://localhost:5001/agregarAuto', { modelo, patente });
            alert('Auto agregado exitosamente');
            obtenerAutos();
            // Limpiar los inputs
            setModelo('');
            setPatente('');
        } catch (error) {
            console.error('Error al agregar el auto:', error);
        }
    };

    // const cobrar = async (id, precioPorHora) => {
    //     try {
    //         const response = await axios.post('http://localhost:5001/cobrar', { id });
    //         const duracion = (new Date(response.data.horaSalida) - new Date(response.data.horaIngreso)) / 1000 / 60 / 60; // horas
    //         const costo = duracion * precioPorHora;

    //         const updatedAutos = autos.map(auto => {
    //             if (auto._id === id) {
    //                 return { ...auto, costoTotal: costo, horaSalida: response.data.horaSalida, cobrado: true };
    //             }
    //             return auto;
    //         });
    //         setAutos(updatedAutos);
    //     } catch (error) {
    //         console.error('Error al cobrar:', error);
    //     }
    // };

    // const cobrar = async (id, precioPorHora) => {
    //     try {
    //         const response = await axios.post('http://localhost:5001/cobrar', { id });
    //         const duracion = (new Date(response.data.horaSalida) - new Date(response.data.horaIngreso)) / 1000 / 60 / 60; // horas
    //         const costo = duracion * precioPorHora;
    
    //         const updatedAutos = autos.map(auto => {
    //             if (auto._id === id) {
    //                 return { ...auto, costoTotal: costo, horaSalida: response.data.horaSalida, cobrado: true };
    //             }
    //             return auto;
    //         });
    //         setAutos(updatedAutos);
    
    //         // Eliminar el auto de la base de datos y del front-end
    //         eliminarAuto(id);
    //     } catch (error) {
    //         console.error('Error al cobrar:', error);
    //     }
    // };
    
    const cobrar = async (id, precioPorHora) => {
        try {
            const response = await axios.post('http://localhost:5001/cobrar', { id });
            const duracion = (new Date(response.data.horaSalida) - new Date(response.data.horaIngreso)) / 1000 / 60 / 60; // horas
            const costo = duracion * precioPorHora;
    
            const updatedAutos = autos.map(auto => {
                if (auto._id === id) {
                    return { ...auto, costoTotal: costo, horaSalida: response.data.horaSalida, cobrado: true };
                }
                return auto;
            });
            setAutos(updatedAutos);
        } catch (error) {
            console.error('Error al cobrar:', error);
        }
    };
    

    // const eliminarAuto = (id) => {
    //     const updatedAutos = autos.filter(auto => auto._id !== id);
    //     setAutos(updatedAutos);
    // };
    const eliminarAuto = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/eliminarAuto/${id}`);
            const updatedAutos = autos.filter(auto => auto._id !== id);
            setAutos(updatedAutos);
        } catch (error) {
            console.error('Error al eliminar el auto:', error);
        }
    };
    

    return (
        <div>
            <div className="menu">
                {loggedIn && (
                    <>
                        <h1>Facturando como {currentUser}</h1>
                        <button onClick={logout} className='boton'>Cerrar Sesión</button>
                    </>
                )}
            </div>
            <div className='login-registrar'>
                {showLoginForm && !loggedIn && (
                    <div className='login'>
                        <h2>Iniciar Sesión</h2>
                        <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={login}>Iniciar Sesión</button>
                        <button onClick={() => setShowLoginForm(false)}>Registrar</button>
                    </div>
                )}
                {!loggedIn && !showLoginForm && (
                    <div className='registrar'>
                        <h2>Registrar</h2>
                        <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={registrar}>Registrar</button>
                        <button onClick={() => setShowLoginForm(true)}>Volver al inicio de sesión</button>
                    </div>
                )}
            </div>
            {loggedIn && (
                <div>
                    <div className='agregar-auto-form'>
                        <h2>Agregar Vehículo</h2>
                        <label>Modelo</label>
                        <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                        <label>Patente</label>
                        <input type="text" placeholder="Patente" value={patente} onChange={(e) => setPatente(e.target.value)} />
                        <button onClick={agregarAuto}>Agregar Vehículo</button>
                    </div>
                    <div className='buscar-auto'>
                        <h2>Buscar Vehículo</h2>
                        <input type="text" className='buscar' placeholder="Buscar por modelo o patente" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
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
                                    <p>Hora de Ingreso: {new Date(auto.horaIngreso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short', hour12: true })}</p>
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
                                    {auto.costoTotal && (
                                        <>
                                            <p><strong>Costo Total:</strong> ${auto.costoTotal.toFixed(2)}</p>
                                            <p><strong>Hora de Salida:</strong> {new Date(auto.horaSalida).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short', hour12: true })}</p>
                                        </>
                                    )}
                                    {/* <button onClick={() => auto.cobrado ? eliminarAuto(auto._id) : cobrar(auto._id, auto.precioPorHora)}>
                                        {auto.cobrado ? 'OK' : 'Cobrar'}
                                    </button> */}
                                    <button onClick={() => auto.cobrado ? eliminarAuto(auto._id) : cobrar(auto._id, auto.precioPorHora)}>
                                        {auto.cobrado ? 'OK' : 'Cobrar'}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
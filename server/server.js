const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/estacionamiento', {
    // useNewUrlParser: true, // Comentado ya que son opciones deprecadas
    // useUnifiedTopology: true // Comentado ya que son opciones deprecadas
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const carSchema = new mongoose.Schema({
    modelo: String,
    patente: String,
    horaIngreso: Date,
    horaSalida: Date,
});

const User = mongoose.model('User', userSchema, 'users');
const Car = mongoose.model('Car', carSchema, 'cars');

// Ruta para registrar usuarios
app.post('/registrar', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.send({ message: 'Usuario registrado exitosamente' });
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.send({ message: 'Inicio de sesión exitoso' });
    } else {
        res.send({ message: 'Credenciales inválidas' });
    }
});

// Ruta para agregar un auto
app.post('/agregarAuto', async (req, res) => {
    const { modelo, patente } = req.body;
    const car = new Car({ modelo, patente, horaIngreso: new Date() });
    await car.save();
    res.send({ message: 'Auto agregado exitosamente' });
});

// Ruta para obtener todos los autos
app.get('/autos', async (req, res) => {
    const autos = await Car.find();
    res.send(autos);
});

// Ruta para cobrar
app.post('/cobrar', async (req, res) => {
    const { id } = req.body;
    const car = await Car.findById(id);
    if (car) {
        car.horaSalida = new Date();
        await car.save();
        const response = {
            horaIngreso: car.horaIngreso,
            horaSalida: car.horaSalida,
        };
        res.send(response);
    } else {
        res.send({ message: 'Auto no encontrado' });
    }
});

app.listen(5001, () => {
    console.log('Servidor está corriendo en el puerto 5001');
});



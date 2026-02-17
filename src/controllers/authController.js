const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (User.findByEmail(email)) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: User.getPublicData(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const isValid = await User.comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login exitoso',
      token,
      user: User.getPublicData(user)
    });
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res) => {
  res.json({ user: User.getPublicData(req.user) });
};

module.exports = { register, login, getMe };
const User = require('../models/User');
const argon2 = require('argon2');

// Regisztráció
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Felhasználónév és jelszó kötelező!' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Már létezik ilyen felhasználó.' });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: 'Sikeres regisztráció!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba a regisztráció közben.' });
  }
};

// Bejelentkezés
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó.' });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Hibás felhasználónév vagy jelszó.' });
    }

    req.session.userId = user._id;
    res.status(200).json({ message: 'Sikeres bejelentkezés!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba a bejelentkezés közben.' });
  }
};

// Profil
exports.profile = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Nincs bejelentkezett felhasználó.' });
  }
  res.status(200).json({ userId: req.session.userId });
};

// Kijelentkezés
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Hiba kijelentkezés közben.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Sikeres kijelentkezés.' });
  });
};

// Felhasználó lekérése session alapján
exports.getUserBySession = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Nincs bejelentkezett felhasználó.' });
    }

    const user = await User.findById(userId).select('-password'); // Jelszó kihagyása
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hiba a felhasználó lekérése közben.' });
  }
};
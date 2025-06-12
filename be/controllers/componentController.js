const Component = require('../models/Component');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.createComponent = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send('Nincs bejelentkezett felhasználó.');
    }

    const { compName, compType, brand, status, description, serial } = req.body;

    const newComponent = new Component({
      compName,
      compType,
      brand,
      status,
      description,
      serial,
      orderedBy: userId
    });

    await newComponent.save();
    res.status(201).json({message: 'Komponens sikeresen létrehozva.', id: newComponent._id});
  } catch (err) {
    console.error(err);
    res.status(500).send('Hiba a komponens létrehozása közben.');
  }
};

const getComponentById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Érvénytelen komponens azonosító.');
  }

  const component = await Component.findById(id).populate('orderedBy', 'username');
  if (!component) {
    throw new Error('Komponens nem található.');
  }

  return component;
}


// exportok
exports.getComponents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';

    const searchQuery = search 
    ? {
      $or: [
        { compName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { serial: { $regex: search, $options: 'i' } },
      ]
    } : {};

    const components = await Component.find(searchQuery).sort({updatedAt: -1}).skip(offset).limit(limit).populate('orderedBy', 'username');

    const totalComponents = await Component.countDocuments();
    res.status(200).json({components, totalComponents});
  } catch (err) {
    console.error(err);
    res.status(500).send('Hiba a komponensek lekérése közben.');
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) {
      return res.status(404).send.json({message: 'Komponens nem található.'});
    }
    res.status(200).json({message: 'Komponens sikeresen törölve.'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Hiba a komponens törlése közben.'});
  }
}

exports.getComponentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const components = await Component.find({ orderedBy: userId }).populate('orderedBy', 'username');
    res.status(200).json(components);
  } catch (err) {
    console.error(err);
    res.status(500).send('Hiba a felhasználó komponenseinek lekérése közben.');
  }
};


exports.updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { compName, compType, brand, status, description, serial } = req.body;

    const updatedComponent = await Component.findByIdAndUpdate(id, {
      compName,
      compType,
      brand,
      status,
      description,
      serial
    }, { new: true });

    if (!updatedComponent) {
      return res.status(404).send('Komponens nem található.');
    }

    res.status(200).json(updatedComponent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Hiba a komponens frissítése közben.');
  }
}
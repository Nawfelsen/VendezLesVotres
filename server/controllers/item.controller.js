const Item = require('../models/item.model').model;

const createItem =
  async (req, res, _) => {
    const newItemData = { ...req.body };
    try {
      if(req.body.price >= 0){
        const createdItem = await Item.create(newItemData);
        res.status(201).json(createdItem);
      }
    }
    catch (error) {
      res.status(400).json(error);
    }
  }

const deleteItem =
  async (req, res) => {
    try {
      await Item.findByIdAndRemove(req.params.itemId);
      console.log(`--> object ${req.params.itemId} deleted`);
      //res.status(301).redirect('/user/me');
      res.send('ok');
    }
    catch (error) {
      throw error;
    }
  }

const getItem =
  async (req, res) => {
    try {
      const item = await Item.findById(req.params.itemId);
      res.status(200).json(item);
    }
    catch (error) {
      throw error;
    }
  }

const getMyItems =
  async (req, res) => {
    try {
      const item = await Item.find({ userId: req.userId });
      res.status(200).json(item);
    }
    catch (error) {
      throw error;
    }
  }

const getOtherItems =
  async (req, res) => {
    try {
      const item = await Item.find({ userId: { $ne: req.userId } });
      res.status(200).json(item);
    }
    catch (error) {
      throw error;
    }
  }


module.exports.create = createItem;
module.exports.delete = deleteItem;
module.exports.getItem = getItem;
module.exports.getMyItems = getMyItems;
module.exports.getOtherItems = getOtherItems;
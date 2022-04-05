const User = require('../models/user.model').model;

module.exports.home = async (req, res) => {
  res.cookie('user', req.userId, { maxAge: 10800000 });
  res.render('user');
}

module.exports.me =
  async (req, res) => {
    const user = await User.findById(req.userId);
    res.status(200).json(user);
  }

module.exports.buying =
  async (req, res) => {
    try {
      const buyer = await User.findById(req.body.userId);
      const seller = await User.findById(req.body.sellerId);
      const updateDataBuyer = { money: buyer.money - req.body.price };
      const updateDataSeller = { money: seller.money + req.body.price };

      await User.findByIdAndUpdate(req.body.userId, updateDataBuyer);
      await User.findByIdAndUpdate(req.body.sellerId, updateDataSeller);

      res.status(200).send("ok");
    }
    catch (error) {
      throw error;
    }
  }

module.exports.getUser =
  async (req, res) => {
    try {
      const user = await User.find({ userId: req.params.userId });
      res.status(200).json(user);
    }
    catch (error) {
      throw error;
    }
  }

  module.exports.updateMoney =
  async (req, res) => {
    try {
      const user = await User.findById(req.body.userId);
      const updateData = { money: user.money + req.body.moneyToAdd };
      
      await User.findByIdAndUpdate(req.body.userId, updateData);
      res.status(200).send("ok");
    }
    catch (error) {
      throw error;
    }
  }




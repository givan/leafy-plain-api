const Router = require('express');
const UserCache = require('../services/UserCache');
const UserGenerator = require('../businessLayer/UserGenerator');
const User = require('../models/User');

const userGenerator = UserGenerator.createInstance();

const router = Router();
router.get('/generate', (req, res) => {
  const countStr = req.query.count ? req.query.count : 1;
  // make sure it's a valid int greater than 0
  let count = 1; // default to 1 new user
  if (req.query.count !== undefined || req.query.count != null || Number.parseInt(req.query.count) > 0) {
    count = Number.parseInt(req.query.count);
  }

  userGenerator.generateNewUsers(count, (err, result) => {
    if (err) {
      return res.status(400).end();
    }

    res.json(
      {
        current: result.newUsers,
        previous: result.existingUsers
      }
    );
  });
});

router.get('/', (req, res) => {

  userGenerator.retrieveAllUsers((err, result) => {
    if (err) {
      return res.status(400).end();
    }

    res.json(result);
  });
});

router.post('/', (req, res) => {
  const hasName = req.body.name !== null && req.body.name.length > 0;
  const hasPhone = req.body.phone !== null && req.body.phone.length > 0;
  if (hasName && hasPhone) {
    const newUser = new User(req.body.name, req.body.phone);

    userGenerator.store(newUser, (err, userCreated) => {
      if (err) {
        res.status(400).end();
      } else {
        res.json(userCreated);
      }
    });
  }
  else {
    res.status(400).end();
  }
});

module.exports = router;

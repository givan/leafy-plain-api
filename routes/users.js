const Router = require('express');
const UserCache = require('../services/UserCache');
const UserGenerator = require('../businessLayer/UserGenerator');
const User = require('../models/User');

const userGenerator = UserGenerator.createInstance();

const router = Router();
router.get('/generate', (req, res) => {
  const count = req.query.count ? req.query.count : -1;

  userGenerator.generateNewUser(1, (err, result) => {
    if (err) {
      return res.status(400).end();
    }

    res.json(
      {
        current: result.newUser,
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

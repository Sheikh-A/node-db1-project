const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  db.select()
    .from('accounts')
    .then((accounts) => {
      res.json(accounts);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error retrieving accounts', err });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.select()
    .from('accounts')
    .where({ id })
    .first()
    .then((account) => {
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(400).json({ message: 'Invalid id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error retrieving account', err });
    });
});

router.post('/', (req, res) => {
  const accountData = req.body;

  db('accounts')
    .insert(accountData)
    .then((account) => {
      res.status(201).json(accountData);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to create new account', err });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('accounts')
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.json({ updated: count });
      } else {
        res.status(404).json({ message: 'Invalid id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to update account', err });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db('accounts')
    .where({ id })
    .del()
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: 'Account deleted' });
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to delete account', err });
    });
});

module.exports = router;

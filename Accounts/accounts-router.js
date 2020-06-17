const express = require('express');

const db = require("../data/dbConfig.js");

const router = express.Router();

// Read of CRUD 
// Implement a GET request to pull in all of the accounts and budgets
// router.get('/', (req, res) => {
  // get the data from the db
  // select * from accounts;
//   db.select('*')
//     .from('accounts') // returns a promise
//     .then(rows => {
//       res.status(200).json({ data: rows }); // Worked on Postman
//     })
//     .catch(error => {
//       res.status(500).json({ message: 'Sorry, could Not pull in your accounts and budgets from the table' });
//     });
// });

//----------------------------------------------------------------------------//
//  GET /api/posts/
//----------------------------------------------------------------------------//
  // The syntax for knex is similar to a SQL statement:
    //  * specify the action (select, delete, update, etc.)
    //  * specify the location (i.e. table name)
    //  * implement filters and other clauses (like where and order by)
    //
    // The knex API is a promise-based API. So the methods return a promise.
    // This means that we can use .then().catch() syntax, or async/await syntax.
    //
    // In addition, knex provides different syntaxes for using its api.
    //
    // - First syntax: You can call the knex object (named "knex" here), and
    //   specify as a parameter the "location" (table name) that you want to
    //   perform an action.
    //
    // - Second syntax: You can call the action method on the knex object, and
    //   specify the location (table name) using methods that are similar to SQL
    //   statements.
    //
    // For example:
    //
    //    knex('table1').select('column1', 'column2').where({conditions}) 
    //
    //      or
    //
    //    knex.select('column1', 'column2').from('table1').where({conditions})
    //
    // These are the same. The second one reads more like a SQL statement.
    //
    // In this example, we are using the first syntax, with .then().catch()
    // handling of the returned promise.


    // router.get('/', async (req,res) => {

//     try {
//         const accounts = await db('accounts');
//         res.json(accounts);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "error retrievign accounts", err });
//     }
// });

// router.get('/', (req, res) => {
//     knex('posts')
//       .then(posts => {
//           res.json(posts);
//       })
//       .catch(err => {
//           console.log(err);
//           res.json(500).json({message: 'problem with db', error:err});
//       });
// });

//----------------------------------------------------------------------------//
//  GET /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware returns a single post, if the ID in the URL is valid.
// 
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//


// router.get('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const account = await db.select('*').from('accounts').where({ id }).first();
//         if (account) {
//             res.status(200).json(account);
//         } else {
//             res.status(400).json({ message: "Post not found" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'sorry ran into error on get:ID' });
//     }
// });

router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.select("*")
    .from("accounts")
    .where({ id });
    .first()
    .then( data => {
        if(data) {
            res.status(200).json({data});
        } else {
            res
              .status(400)
              .json({ message: "Could not ifnd that account by ID" });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Error from DB" });
    });
});

// router.get('/:id', (req, res) => {
//     db('accounts')
//       .where({ id: req.params.id })
//       .first() // the library knows we always want the first element of the array
//       .then(account => { // I will get a collection/array back because it's relational db
//         if (account) {
//           res.status(200).json({ data: account }); // returns an obj instead of an array - Worked on Postman
//         } else {
//           res.status(404).json({ message: "Account Not Found" }); // always show the right message
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ message: "Sorry, ran into an error" }); 
//       });
//   });
  

//----------------------------------------------------------------------------//
//  POST /api/posts
//----------------------------------------------------------------------------//
//  This middleware allows the creation of a new post.
// 
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//

router.post('/', validatePost, async(req, res) => {
    const accountData = req.body;

    try {
        const account = await db.insert(accountData).into('accounts');
        res.status(201).json(accountData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'db problem adding account', error: err });
    }
});

// router.post('/', (req, res) => {
//     db('accounts')
//       .insert(req.body, "id") // second argument for postgress - it doesn't return an id automatically
//       .then(ids => {
//       res.status(201).json({ newID: ids }) // SQLite3 will return an array of ids - Worked on Postman
//     }) 
//     .catch(error => {
//       res.status(500).json({ message: "Sorry, could Not add the new data to the table" });
//     });
//   });

//----------------------------------------------------------------------------//
//  PUT /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware allows the modification of an existing post ("update")
// 
//  This example uses the first syntax, with .then().catch() promise handling.
//----------------------------------------------------------------------------//

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('accounts').where({ id }).update(changes)
      .then(count => {
          if (count) {
              res.status(200).json({ updated: count });
          } else {
              res.status(404).json({ message: 'invalid id' });
          }
      })
      .catch(err => {
          res.status(500).json({ message: 'db problem with PUT' });
      });
});

//----------------------------------------------------------------------------//
//  DELETE /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware allows the deletion of an existing post.
// 
//  This example uses the second syntax with async/await promise handling.
// 
//  Note that it also uses the "ternary" operator to handle the result of the
//  delete, rather than an if()..else() statement.
//----------------------------------------------------------------------------//

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const count = await db.del().from('accounts').where({ id });
        count ? res.status(200).json({ deleted: count })
            : res.status(404).json({ message: 'invalid id' });
    } catch (err) {
        res.status(500).json({ message: "db error DELETE", error: err });
    }
});

// Delete of CRUD - del - filter with ID so that it doesn't delete everything. 
// router.delete('/:id', (req, res) => {
//     db("accounts")
//       .where({ id: req.params.id }) // Will not delete unless there's a value.
//       .del() // You gotta tell it what to do - return, update or delete it. Delete the records - Magic line
//       .then((count) => {
//         if (count > 0) { // If you can't find the record, it's going to return 0 - falsy - don't rely on it.
//           res.status(200).json({ message: "record deleted successfully" }); // Worked on Postman
//         } else {
//           res.status(400).json({ message: "Account Not Found" });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ message: "Sorry, ran into an error" }); // Always catch it. 
//       })
//   });

/* Stretch Problems 
- Add a `query string` option to your `GET /api/accounts` endpoint. The `query string` may contain `limit`, `sortby` and `sortdir` keys. If these keys are provided, use these values to limit and sort the `accounts` which are selected from the database. Reference the docs for sorting and limiting in `knex`.
```js
// sample req.query object
{
  limit: 5,
  sortby: 'id',
  sortdir: 'desc'
}
```
*/
// Pull in the limit (5) and sorted accounts that were selected from the db. 
// queryString
router.get("/", (req, res) => {
    const orderby = req.query.orderby || "name";
    const limit = req.query.limit || -1;
    const sortdir = req.query.sortdir || "desc";
    db.select("*")
      .from("accounts")
      .orderBy(orderby, sortdir)
      .limit(limit)
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err =>
        res.status(500).json({ message: "error retrieving posts", err })
      );
  });

function validatePost(req, res, next) {
// do your magic!
const body = req.body;
if (typeof body.budget !== "number") {
    res
    .status(404)
    .json({ message: "please add a valid number to budget field" });
}
if (!body.name) {
    res.status(404).json({ message: "missing required name field" });
} else if (!body.budget) {
    res.status(404).json({ message: "missing required budget field" });
} else {
    next();
}
}




module.exports = router;

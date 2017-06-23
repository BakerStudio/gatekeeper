const express = require('express');
// you'll need to use `queryString` in your `gateKeeper` middleware function
const queryString = require('query-string');
const morgan = require('morgan');
// const bodyParser = require('body-parser');

const app = express();

// our app will use bodyParser to try to
// parse JSON and/or URL encoded data from
// request bodies. If you don't add
// body parsing middleware, even if the raw
// request contains, say, a JSON body,
// `req.body` will be empty in the request handler
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// For this challenge, we're hard coding a list of users, because
// we haven't learned about databases yet. Normally, you'd store
// user data in a database, and query the database to find
// a particular user.
//
// ALSO, for this challenge, we're storing user passwords as
// plain text. This is something you should NEVER EVER EVER
// do in a real app. Instead, always use cryptographic
// password hashing best practices (aka, the tried and true
// ways to keep user passwords as secure as possible).
// You can learn mroe about password hashing later
// here: https://crackstation.net/hashing-security.htm
const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  }
];


// write a `gateKeeper` middleware function that:
//  1. looks for a 'x-username-and-password' request header
//  2. parses values sent for `user` and `pass` from 'x-username-and-password'
//  3. looks for a user object matching the sent username and password values
//  4. if matching user found, add the user object to the request object
//     (aka, `req.user = matchedUser`)
function gateKeeper(req, res, next) {
  // your code should replace the line below
  // console.log("in gateKeeper: " + req.method);
  // console.log("url: " + req.url);
  // console.log("path: " + req.path);
  // console.dir("params: " + req.params);
  // console.log("headers: " + JSON.stringify(req.headers));
  // const logObj = {
  //   time: (new Date()).toTimeString(),
  //   method: req.method,
  //   hostname: req.hostname,
  //   path: req.path,
  //   "content type": req.get('Content-Type'),
  //   query: JSON.stringify(req.query),
  //   body: JSON.stringify(req.body)
  // }
  // console.dir(logObj);

  let x;
  for (x in req.headers) {
    if (x == "x-username-and-password") {
      // console.log("GOT HEADER!! " + req.headers[x]);
      let userInfo = queryString.parse(req.headers[x]);
      // console.log("Query String: " + JSON.stringify(userInfo));
      // console.log("userInfo[user]: " + userInfo.user);
      for (let y in USERS) {
        if (userInfo.user == USERS[y].userName) {
          // console.log("MATCH");
          req.user = USERS[y];
          next();
        }
      }
    }
    req.user = null;
  }

  next();
}

function logRequest(req, res, next) {
  console.log("in logRequest");
  const logObj = {
    time: (new Date()).toTimeString(),
    method: req.method,
    hostname: req.hostname,
    path: req.path,
    "content type": req.get('Content-Type'),
    query: JSON.stringify(req.query),
    body: JSON.stringify(req.body)
  }
  console.dir(logObj);
  // we'll learn more about middleware later in this course, but for now
  // know that calling `next()` causes the next function in the middleware stack
  // to be called
  next();
};

// app.all captures all requests to `/`, regardless of
// the request method.
// app.all('/', logRequest);

app.use(morgan('common'));

// Add the middleware to your app!
app.use(gateKeeper);

// this endpoint returns a json object representing the user making the request,
// IF they supply valid user credentials. This endpoint assumes that `gateKeeper`
// adds the user object to the request if valid credentials were supplied.
app.get("/api/users/me", (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === null) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  // we're only returning a subset of the properties
  // from the user object. Notably, we're *not*
  // sending `password` or `isAdmin`.
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 3000}`);
});

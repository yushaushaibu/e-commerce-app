const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");
const { getOneBy } = require("./repositories/users");
const { application } = require("express");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["h23vba9lo3a77"],
  })
);

app.get("/signup", (req, res) => {
  res.send(`
            Your ID is: <strong>${req.session.userId}</strong>
            <div>
                <form method="POST">
                    <input name="email" placeholder="email">
                    <input name="password" placeholder="password">
                    <input name="passwordConfirmation" placeholder="password confirmation">
                    <button>Sign up</button>
                </form>
            </div>
    `);
});

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email is already in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("Password do not match");
  }

  const user = await usersRepo.create({ email, password });
  req.session.userId = user.id;

  res.send("Account created!!");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

app.get('/signin', (req, res) => {
  res.send(`
      <form method="POST">
        <input name="email" placeholder="email">
        <input name="password" placeholder="password">
        <button>Sign In</button>
      </form>
  `)
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });
  
  if (!user) {
    return res.send('User email not found');
  }

  if (user.password !== password) {
    return res.send('Incorrect password');
  }

  req.session.userId = user.id;
  res.send('You are signed in');

});

app.listen(3000, () => {
  console.log("Listening..");
});

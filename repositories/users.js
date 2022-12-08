const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt); // turns scrypt into a promisified function
class UsersRepository extends repository {
  async create(attrs) {
    // attrs === { email:'', password:'' }
    attrs.id = this.randomId();
    const salt = crypto.randomBytes(8).toString("hex");
    const buffer = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buffer.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);
    return record;
  }

  async comparePasswords(savedPass, userLogginPass) {
    // savedPass -> password save in our database ie hashed.salt
    // userLoggingPass -> Signin password entered by user
    const [hashed, salt] = savedPass.split(".");
    const hashedUserLogginPass = await scrypt(userLogginPass, salt, 64);

    return hashed === hashedUserLogginPass.toString("hex");
  }
}

// const test = async () => {
//   const repo = new UsersRepository("users.json"); // access users repo
//   await repo.create({ email: 'realme@you.com'});
//   await repo.update("7aeb3a8140", {password: 'ys201091'});
//   const user = await repo.getOneBy({
//     email: "realme1@you.com",
//     id: "7aeb3a8140",
//   });
//   console.log(user);
// };

// test();

// EXPORTING INSTANCE OF THE CLASS
module.exports = new UsersRepository("users.json");

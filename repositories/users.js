const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a new repository requires a filename");
    }

    this.filename = filename;

    try {
      fs.accessSync(this.filename); // check if file exist
    } catch (err) {
      fs.writeFileSync(this.filename, "[]"); // writes/creates new file
    }
  }

  // reads content in file, convert to JS object and return data
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  // collect records from getAll(). attrs is an object containing user form data
  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  // writes users into record
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  // makes a randomized ID
  randomId() {
    return crypto.randomBytes(5).toString("hex");
  }

  // finds record using id entered
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  // deletes record using id entered
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  // update records
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  // finds record using any filter like email, id etc.
  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

// const test = async () => {
//   const repo = new UsersRepository("users.json"); // access users repo
// await repo.create({ email: 'realme@you.com'});
// await repo.update("7aeb3a8140", {password: 'ys201091'});
//   const user = await repo.getOneBy({
//     email: "realme1@you.com",
//     id: "7aeb3a8140",
//   });
//   console.log(user);
// };

// test();

// EXPORTING INSTANCE OF THE CLASS
module.exports = new UsersRepository('users.json');

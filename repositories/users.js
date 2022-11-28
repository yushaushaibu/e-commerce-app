const fs = require("fs");

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

  async getAll() {
    // reads content in file, convert to JS object and return data
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  // creates records. attrs is an object containing user form data
  async create(attrs) {
    const records = await this.getAll();
    records.push(attrs);

    await fs.promises.writeFile(this.filename, JSON.stringify(records))
  }
}

const test = async () => {
  const repo = new UsersRepository("users.json"); // access users repo
  await repo.create({ email: 'test@test.com', password: 'password'}); // save new records to users.json
  const users = await repo.getAll();  // get all users records
  console.log(users);
};

test();

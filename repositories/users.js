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

  async getAll() {
    // reads content in file, convert to JS object and return data
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  // creates records from getAll() data. attrs is an object containing user form data
  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  // writes users record
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(5).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }
}

const test = async () => {
  const repo = new UsersRepository("users.json"); // access users repo
  await repo.delete("cf7c894b9d");
};

test();

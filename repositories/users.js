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
}

const test = async () => {
  const repo = new UsersRepository("users.json");
  const users = await repo.getAll();
  console.log(users);
};

test();

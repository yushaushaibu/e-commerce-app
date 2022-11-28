const fs = require('fs');

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a new repository requires a filename');
        }

        this.filename = filename;

        try {
            fs.accessSync(this.filename);  // check if file exist
        } catch (err) {

            fs.writeFileSync(this.filename, '[]'); // writes/creates new file
        }  
    }

    async getAll() {
        const contents = await fs.promises.readFile(this.filename, { encoding: 'utf8'});  // reads entire content in file

        const data = JSON.parse(contents);  // convert data from JSON object to JS object
        return data;  // return parsed data
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');
    const users = await repo.getAll();
    console.log(users);
};

test();

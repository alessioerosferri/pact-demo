const faker = require("@faker-js/faker");

const accounts = {
  1: {
    first_name: "Alessio Eros",
    last_name: "Ferri",
    email: "alessio.ferri@clearchannel.co.uk",
    balance: 100.0,
  },
  2: {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    balance: 1000.0,
  },
  3: {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    balance: 300.0,
  },
};
module.exports = {
  getAccount: (id) => {
    return accounts[id];
  },
  updateAccount: (id, data) => {
    accounts[id] = { ...accounts[id], ...data };
    return accounts[id];
  },
  accounts,
};

const axios = require("axios");
const { account_service } = require("../constants");

const accountServiceApi = axios.create({
  baseURL: account_service,
});

const getAccountInfo = async (id) => {
  const {
    data: { account },
  } = await accountServiceApi.get("v1/accounts/" + id);
  return account;
};

module.exports = { getAccountInfo };

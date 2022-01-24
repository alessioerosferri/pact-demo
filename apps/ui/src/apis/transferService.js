const axios = require("axios");
const { transaction_service } = require("../constants");

const transferService = axios.create({
  baseURL: transaction_service,
});

const newTransaction = async (source_id, destination_id, amount) => {
  const {
    data: { transfer },
  } = await transferService.post("v1/transfers", {
    transfer: { source_id, destination_id, amount: parseInt(amount) },
  });
  return transfer;
};

module.exports = { newTransaction };

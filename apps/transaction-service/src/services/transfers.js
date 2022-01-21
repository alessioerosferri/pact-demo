const { getAccountInfo, updateBalance } = require("../../apis/accountService");

const STATUSES = {
  SUCCESS: "SUCCESS",
  NOT_ENOUGH_FUNDS: "NOT_ENOUGH_FUNDS",
  ACCOUNT_NOT_EXISTING: "ACCOUNT_NOT_EXISTING",
};
module.exports = {
  startTransfer: async (source_id, destination_id, amount) => {
    let status;
    const sourceAccount = await getAccountInfo(source_id);
    const destinationAccount = await getAccountInfo(destination_id);
    if (sourceAccount.email && destinationAccount.email) {
      if (sourceAccount.balance >= amount) {
        status = STATUSES.SUCCESS;
        await updateBalance(source_id, sourceAccount.balance - amount);
        await updateBalance(
          destination_id,
          destinationAccount.balance + amount
        );
      } else {
        status = STATUSES.NOT_ENOUGH_FUNDS;
      }
    } else {
      status = STATUSES.ACCOUNT_NOT_EXISTING;
    }
    return { source_id, destination_id, amount, status };
  },
};

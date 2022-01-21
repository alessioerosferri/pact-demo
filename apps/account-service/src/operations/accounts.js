const accountsService = require("../services/accounts");

const getAccountInfo = async (req, res) => {
  const account = accountsService.getAccount(req.params.accountid);
  try {
    res.json({ account });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const updateAccount = async (req, res) => {
  const account = accountsService.updateAccount(
    req.params.accountid,
    req.body.account
  );
  try {
    res.json({ account });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

module.exports = { getAccountInfo, updateAccount };

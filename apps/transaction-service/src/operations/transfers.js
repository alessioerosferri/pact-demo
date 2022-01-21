const transfersService = require("../services/transfers");

const newTransfer = async (req, res) => {
  const { source_id, destination_id, amount } = req.body.transfer;
  const transfer = await transfersService.startTransfer(
    source_id,
    destination_id,
    amount
  );
  try {
    res.json({ transfer });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

module.exports = { newTransfer };

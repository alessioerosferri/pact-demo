const pact = require("@pact-foundation/pact-node");
const path = require("path");
const opts = {
  pactFilesOrDirs: [path.resolve("pact/pacts")],
  pactBroker: process.env.PACT_BROKER || "https://clearchannel.pactflow.io",
  pactBrokerToken: "MxHhMrhKxJMpnzWgpmoiAA",
  consumerVersion: "1.0.0",
};

pact
  .publishPacts(opts)
  .then(() => {
    // eslint-disable-next-line no-console,no-console
    console.log("Pact contract publishing complete!");
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.log("Pact contract publishing failed: ", e);
  });

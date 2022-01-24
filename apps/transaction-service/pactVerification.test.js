const { Verifier } = require("@pact-foundation/pact");
const { server_port } = require("./constants");
const { app } = require("./index");
const { getAccountInfo } = require("./apis/accountService");

jest.mock("./apis/accountService", () => {
  return {
    getAccountInfo: jest.fn(),
    updateBalance: jest.fn().mockResolvedValue({}),
  };
});

let handler = app.listen(server_port, () => {});

jest.setTimeout(300000);

describe("Pact Verification", () => {
  it("should validate the expectations on pact", (done) => {
    let opts = {
      providerBaseUrl: "http://127.0.0.1:5001",
      pactBrokerUrl: "https://clearchannel.pactflow.io",
      provider: "transfer-service",
      stateHandlers: {
        "i have enough funds": () => {
          getAccountInfo.mockResolvedValue({
            first_name: "Alessio Eros",
            last_name: "Ferri",
            email: "alessio.ferri@clearchannel.co.uk",
            balance: 100.0,
          });
          return Promise.resolve();
        },
        "i don't have enough funds": () => {
          getAccountInfo.mockResolvedValue({
            first_name: "Alessio Eros",
            last_name: "Ferri",
            email: "alessio.ferri@clearchannel.co.uk",
            balance: 0.0,
          });
          return Promise.resolve();
        },
      },
      pactBrokerToken: "MxHhMrhKxJMpnzWgpmoiAA",
      providerVersion: "1.0.0",
      publishVerificationResult: true,
    };

    new Verifier()
      .verifyProvider(opts)
      .then((output) => {
        console.log("Pact Verification Complete!");
        console.log(output);
        done();
      })
      .catch((error) => {
        console.log("error", error);
        done(error);
      });
  });
});

afterAll(() => {
  handler.close();
});

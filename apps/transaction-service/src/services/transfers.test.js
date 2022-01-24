const { pactWith } = require("jest-pact");
const { Matchers } = require("@pact-foundation/pact");
const { startTransfer } = require("./transfers");

pactWith(
  {
    consumer: "transfer-service",
    provider: "account-service",
    port: 5000,
    host: "127.0.0.1",
  },
  (provider) => {
    describe("account API", () => {
      const accountResponse = {
        status: 200,
        headers: {
          "Content-Type": Matchers.term({
            generate: "application/json",
            matcher: "application/json",
          }),
        },
        body: Matchers.like({
          account: {
            first_name: "Josefa",
            last_name: "Ortiz",
            email: "Ezekiel32@gmail.com",
            balance: 300,
          },
        }),
      };

      const accountRequest = {
        uponReceiving: "a request for an account data",
        withRequest: {
          method: "GET",
          path: Matchers.term({
            generate: "/v1/accounts/1",
            matcher: "/v1/accounts/\\d+",
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        },
      };

      const accountUpdateRequest = {
        uponReceiving: "a request to update an account balance",
        withRequest: {
          method: "PATCH",
          path: Matchers.term({
            generate: "/v1/accounts/1",
            matcher: "/v1/accounts/\\d+",
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": Matchers.term({
              generate: "application/json",
              matcher: "application/json",
            }),
          },
          body: Matchers.like({
            account: {
              balance: 300,
            },
          }),
        },
      };

      beforeAll(async () => {
        const interaction = {
          state: "i have an account",
          ...accountRequest,
          willRespondWith: accountResponse,
        };
        const updateInteraction = {
          state: "i have an account",
          ...accountUpdateRequest,
          willRespondWith: accountResponse,
        };
        // await provider.addInteraction(interaction);
        await provider.addInteraction(interaction);
        await provider.addInteraction(updateInteraction);
      });

      // add expectations
      it("returns a successful body", async () => {
        const transfer = await startTransfer(1, 2, 10);
        expect(transfer).toEqual({
          amount: 10,
          destination_id: 2,
          source_id: 1,
          status: "SUCCESS",
        });
      });
    });
  }
);

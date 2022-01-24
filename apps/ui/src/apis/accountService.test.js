"use strict";

import { pactWith } from "jest-pact";
import { getAccountInfo } from "./accountService";

pactWith(
  {
    consumer: "ui",
    provider: "account-service",
    port: 5000,
    host: "127.0.0.1",
  },
  (provider) => {
    describe("account API", () => {
      const accountResponse = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          account: {
            first_name: "Josefa",
            last_name: "Ortiz",
            email: "Ezekiel32@gmail.com",
            balance: 300,
          },
        },
      };

      const accountRequest = {
        uponReceiving: "a request for an account data",
        withRequest: {
          method: "GET",
          path: "/v1/accounts/1",
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        },
      };

      beforeEach(() => {
        const interaction = {
          state: "i have an account",
          ...accountRequest,
          willRespondWith: accountResponse,
        };
        return provider.addInteraction(interaction);
      });

      // add expectations
      it("returns a successful body", async () => {
        const account = await getAccountInfo(1);
        expect(account).toEqual({
          first_name: expect.any(String),
          last_name: expect.any(String),
          email: expect.any(String),
          balance: expect.any(Number),
        });
      });
    });
  }
);

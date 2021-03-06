"use strict";

import { pactWith } from "jest-pact";
import { Matchers } from "@pact-foundation/pact";
import { getAccountInfo } from "./accountService";
const { term } = Matchers;

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
          path: term({
            generate: "/v1/accounts/1",
            matcher: "/v1/accounts/[0-9]+",
          }),
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

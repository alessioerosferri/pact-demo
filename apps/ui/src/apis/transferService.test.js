"use strict";

import { pactWith } from "jest-pact";
import { newTransaction } from "./transferService";

pactWith(
  {
    consumer: "ui",
    provider: "transfer-service",
    port: 5001,
    host: "127.0.0.1",
  },
  (provider) => {
    describe("transfer API", () => {
      const transferResponseSuccess = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          transfer: {
            source_id: 1,
            destination_id: 2,
            amount: 10,
            status: "SUCCESS",
          },
        },
      };

      const transferResponseNotFunds = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          transfer: {
            source_id: 1,
            destination_id: 2,
            amount: 10,
            status: "NOT_ENOUGH_FUNDS",
          },
        },
      };

      const transferRequest = {
        withRequest: {
          method: "POST",
          path: "/v1/transfers",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: {
            transfer: {
              source_id: 1,
              destination_id: 2,
              amount: 10,
            },
          },
        },
      };

      const interaction = {
        state: "i have enough funds",
        uponReceiving: "a request for a new transfer with enough funds",
        ...transferRequest,
        willRespondWith: transferResponseSuccess,
      };
      const interaction2 = {
        state: "i don't have enough funds",
        uponReceiving: "a request for a new transfer without funds",
        ...transferRequest,
        willRespondWith: transferResponseNotFunds,
      };

      // add expectations
      it("returns a successful body for a successful transfer", async () => {
        await provider.addInteraction(interaction);
        const transfer = await newTransaction(1, 2, 10);
        expect(transfer).toEqual({
          source_id: expect.any(Number),
          destination_id: expect.any(Number),
          amount: expect.any(Number),
          status: "SUCCESS",
        });
      });

      it("returns a successful body for not NOT_ENOUGH_FUNDS status", async () => {
        await provider.addInteraction(interaction2);
        const transfer = await newTransaction(1, 2, 10);
        expect(transfer).toEqual({
          source_id: expect.any(Number),
          destination_id: expect.any(Number),
          amount: expect.any(Number),
          status: "NOT_ENOUGH_FUNDS",
        });
      });
    });
  }
);

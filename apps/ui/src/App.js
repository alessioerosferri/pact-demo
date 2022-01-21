import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import "./App.css";
import { getAccountInfo } from "./apis/accountService";
import { Button, FormControl, TextField } from "@mui/material";
import { newTransaction } from "./apis/transferService";

const getLocale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
};

const getFormattedCurrency = (amount) => {
  return new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const reloadAccounts = async () => {
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(getAccountInfo(i + 1));
  }
  return Promise.all(promises);
};

const CustomSelect = ({ label, values, handleChange, value }) => {
  return (
    <>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {values.map((val) => {
          return <MenuItem value={val}>{val}</MenuItem>;
        })}
      </Select>
    </>
  );
};

function App() {
  const [accounts, setAccounts] = React.useState([]);
  const [source, setSource] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);
  React.useEffect(async () => {
    setAccounts(await reloadAccounts());
  }, [transactions]);
  const renderAccounts = () => {
    return accounts.map((a) => {
      return (
        <tr>
          <td>{a.first_name}</td>
          <td>{a.last_name}</td>
          <td>{a.email}</td>
          <td>{getFormattedCurrency(a.balance)}</td>
        </tr>
      );
    });
  };
  const sendTranfer = async () => {
    const transaction = await newTransaction(source, destination, amount);
    console.log(transaction);
    setTransactions((ts) => [...ts, transaction]);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className="transaction-box">
          <FormControl>
            <CustomSelect
              values={[1, 2, 3]}
              label="Source"
              value={source}
              handleChange={(e) => setSource(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <CustomSelect
              values={[1, 2, 3]}
              label="Destination"
              value={destination}
              handleChange={(e) => setDestination(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="Amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </FormControl>
          <FormControl>
            <Button variant="outlined" onClick={sendTranfer}>
              Submit
            </Button>
          </FormControl>
        </div>
        <div className="accounts-table">
          <table>
            <thead>
              <tr>
                <th>first name</th>
                <th>last name</th>
                <th>email</th>
                <th>balance</th>
              </tr>
            </thead>
            <tbody>{renderAccounts()}</tbody>
          </table>
        </div>
        {transactions.map((t, index) => {
          return (
            <p>
              Transaction {index + 1} status: {t.status}
            </p>
          );
        })}
      </header>
    </div>
  );
}

export default App;

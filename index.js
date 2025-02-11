const express = require("express");
const { resolve } = require("path");
const cors = require("cors");
const app = express();
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
const port = 3000;

let stocks = [
  { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
  { stockId: 2, ticker: "GOOGL", companyName: "Alphabet Inc.", price: 2750.1 },
  { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
];

let trades = [
  {
    tradeId: 1,
    stockId: 1,
    quantity: 10,
    tradeType: "buy",
    tradeDate: "2024-08-07",
  },
  {
    tradeId: 2,
    stockId: 2,
    quantity: 5,
    tradeType: "sell",
    tradeDate: "2024-08-06",
  },
  {
    tradeId: 3,
    stockId: 3,
    quantity: 7,
    tradeType: "buy",
    tradeDate: "2024-08-05",
  },
];

const getAllStocks = () => {
  return stocks;
};
const getStockByTicker = (tickerName) => {
  console.log("tickerName", tickerName);
  const res = stocks.filter((stock) => stock.ticker === tickerName);
  console.log("Result is", res);
  return res;
};
const makeTrade = (newTrade) => {
  const newTradeRes = { tradeId: trades.length + 1, ...newTrade };
  console.log("New trade is", newTradeRes);
  trades.push(newTradeRes);
  return newTradeRes;
};

app.get("/stocks", (req, res) => {
  try {
    const response = getAllStocks();
    if (response.length === 0) {
      return res.status(404).json({ message: "Stocks were not present" });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.get("/stocks/:ticker", (req, res) => {
  const ticker = req.params.ticker;
  console.log(ticker);
  try {
    const response = getStockByTicker(ticker);
    if (response.length === 0) {
      return res.status(404).json({
        message:
          "The ticker which has been provided does not exist in the database",
      });
    }
    return res.status(200).json({ stock: response[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.post("/trades/new", (req, res) => {
  const trade = req.body;
  console.log(trade);
  try {
    const response = makeTrade(trade);
    if (!trade || Object.keys(trade).length === 0) {
      return res.status(400).json({ message: "The request body is not valid" });
    }
    console.log({ trade: response[0] });
    return res.status(201).json({ response });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = { app, getAllStocks, getStockByTicker, makeTrade };

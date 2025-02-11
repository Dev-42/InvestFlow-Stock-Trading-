let stocks = [
    { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
    { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
    { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
  ];
  
  let trades = [
    { tradeId: 1, stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' },
    { tradeId: 2, stockId: 2, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' },
    { tradeId: 3, stockId: 3, quantity: 7, tradeType: 'buy', tradeDate: '2024-08-05' },
  ];

const getAllStocks = () => {
    return stocks
}  
const getStockByTicker = (tickerName) => {
    console.log("tickerName",tickerName)
    const res =  stocks.filter((stock) => stock.ticker === tickerName)
    console.log("Result is",res)
    return res
}
const makeTrade = (newTrade) => {
    const newTradeRes = {tradeId: trades.length + 1, ...newTrade}
    console.log("New trade is",newTradeRes)
    trades.push(newTradeRes)
    return newTradeRes
}
module.exports = {getAllStocks,getStockByTicker,makeTrade}
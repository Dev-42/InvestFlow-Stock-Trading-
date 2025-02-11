const express = require('express');
const { resolve } = require('path');
const cors = require('cors')
const {getAllStocks,getStockByTicker,makeTrade} = require('./controllers/index')


const app = express();
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json())
const port = 3010;

app.get('/stocks',(req,res) => {
  try{
    const response = getAllStocks()
    if(response.length === 0){
      return res.status(404).json({message : "Stocks were not present"})
    }
    return res.status(200).json(response)
  }catch(error){
    return res.status(500).json({error:error.message})
  }
})
app.get('/stocks/:ticker',(req,res) => {
  const ticker = req.params.ticker
  console.log(ticker)
  try{
    const response = getStockByTicker(ticker)
    if(response.length === 0){
      return res.status(404).json({message: "The ticker which has been provided does not exist in the database"})
    }
    return res.status(200).json({stock:response[0]})
  }catch(error){
    return res.status(500).json({error:error.message})
  }
})
app.post('/trades/new',(req,res) => {
  const trade = req.body
  try{
    const response = makeTrade(trade)
    if(response.length === 0){
      return res.status(401).json({message:"The request body is not valid"})
    }
    console.log({trade: response[0]})
    return res.status(201).json({trade: response[0]})
  }catch(error){
    return res.status(500).json({error : error.message})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

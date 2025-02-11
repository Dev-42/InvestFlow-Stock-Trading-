const express = require('express');
const { resolve } = require('path');
const {getAllStocks} = require('./controllers/index')

const app = express();
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

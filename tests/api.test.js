const { app, getAllStocks, getStockByTicker, makeTrade } = require("../index");
const request = require("supertest");
const http = require("http");

jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  getAllStocks: jest.fn(),
  getStockByTicker: jest.fn(),
  makeTrade: jest.fn(),
}));
let server;
beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});
afterAll((done) => {
  server.close(done);
});

describe("API route tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("GET /stocks endpoint should retrieve all stocks", async () => {
    let mockStocks = [
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
      { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
    ];
    const response = await request(server).get("/stocks");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStocks);
  });
  test("GET /stocks/:ticker endpoint should successfully retrieves a specific stock", async () => {
    let mockStocks = [
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
      { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
    ];
    const response = await request(server).get("/stocks/AAPL");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      stock: {
        stockId: 1,
        ticker: "AAPL",
        companyName: "Apple Inc.",
        price: 150.75,
      },
    });
  });
  test(" POST /trades endpoint should successfully add a new trade with valid input", async () => {
    const response = await request(server).post("/trades/new").send({
      stockId: 1,
      quantity: 25,
      tradeType: "buy",
      tradeDate: "2024-09-010",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      response: {
        tradeId: 4,
        stockId: 1,
        quantity: 25,
        tradeType: "buy",
        tradeDate: "2024-09-010",
      },
    });
  });
  test("GET /stocks/:ticker endpoint should return a 404 status code when provided with an invalid ticker", async () => {
    const response = await request(server).get("/stocks/AAP");
    console.log("Response is", response);
    expect(response.status).toBe(404);
    expect(response._body.message).toEqual(
      "The ticker which has been provided does not exist in the database"
    );
  });
  test("POST /trades/new should return a 400 status code when provided with invalid input", async () => {
    const invalidTrade = {};

    const response = await request(server)
      .post("/trades/new")
      .send(invalidTrade);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "The request body is not valid" });
  });
  test("Ensure that getAllStocks returns the correct mocked data", () => {
    let mockStocks = [
      { stockId: 1, ticker: "AAPL", companyName: "Apple Inc.", price: 150.75 },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1,
      },
      { stockId: 3, ticker: "TSLA", companyName: "Tesla, Inc.", price: 695.5 },
    ];
    getAllStocks.mockReturnValue(mockStocks);
    let result = getAllStocks();
    expect(result).toEqual(mockStocks);
    expect(getAllStocks).toHaveBeenCalled();
  });
  test("makeTrade function should work correctly and should return the expected output", () => {
    let mockTrade = {
      response: {
        tradeId: 4,
        stockId: 1,
        quantity: 20,
        tradeType: "buy",
        tradeDate: "2024-08-010",
      },
    };
    makeTrade.mockReturnValue(mockTrade);
    let result = makeTrade({
      stockId: 1,
      quantity: 20,
      tradeType: "buy",
      tradeDate: "2024-08-010",
    });
    expect(result).toEqual(mockTrade);
    expect(makeTrade).toHaveBeenCalledTimes(1);
    expect(makeTrade).toHaveBeenCalledWith({
      stockId: 1,
      quantity: 20,
      tradeType: "buy",
      tradeDate: "2024-08-010",
    });
  });
});

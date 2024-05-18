import { useEffect, useState } from "react";
import "./app.scss";
import { fetchCoinData } from "./service";

const ItemRow = ({ data }) => {
  return (
    <tr>
      <td>
        <img src={data.image} alt="Avatar" className="image" />
        {data.name}
      </td>
      <td>{data.symbol.toUpperCase()}</td>
      <td>${data.current_price.toLocaleString()}</td>
      <td className={data.price_change_percentage_24h > 0 ? "green" : "red"}>
        {data.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>Mkt Cap: ${data.market_cap.toLocaleString()}</td>
    </tr>
  );
};

const SearchBar = ({ onSearch, onSortByMarketCap, onSortByPercentChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearch = () => {
    onSearch(searchTerm);
  };
  return (
    <div className="search-bar">
      <input
        placeholder="Search By Name or Symbol"
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={onSortByMarketCap}>Sort By Mkt Cap</button>
      <button onClick={onSortByPercentChange} className="dark">
        Sort By Percent Change
      </button>
    </div>
  );
};

const App = () => {
  const [coinData, setCoinData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    //  fetch the coin data  //
    (async function () {
      const { success, data } = await fetchCoinData();
      console.log("data", data);
      if (success) {
        setCoinData(data);
        setFilteredData(data);
      } else {
        setCoinData(data);
        setFilteredData(data);
        alert(
          "Live Data colud not load at the moment. Loading the table with dummy data"
        );

        console.log("An Error occured");
      }
    })();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = coinData.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  const handleSortByMarketCap = () => {
    const sorted = [...filteredData].sort(
      (a, b) => b.market_cap - a.market_cap
    );
    setFilteredData(sorted);
  };
  const handleSortByPercentChange = () => {
    const sorted = [...filteredData].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    setFilteredData(sorted);
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <h1>Coin Exchange</h1>
        <SearchBar
          onSearch={handleSearch}
          onSortByMarketCap={handleSortByMarketCap}
          onSortByPercentChange={handleSortByPercentChange}
        />
        <table id="cryptoTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price (USD)</th>
              <th>Price % change</th>
              <th>Total Volume</th>
            </tr>
          </thead>
          <tbody id="cryptoBody">
            {filteredData.map((item, index) => (
              <ItemRow data={item} key={index} />
            ))}
          </tbody>
        </table>
        {filteredData.length == 0 ? (
          <h5 style={{ textAlign: "center" }}>No Data</h5>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default App;

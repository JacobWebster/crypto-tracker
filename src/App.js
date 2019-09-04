import React, { Component } from 'react';
import "./App.css";
import NumberFormat from 'react-number-format';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cryptos: [],
      isLoaded: true,
      isDetailsOn: false,
    };
  }
  operation = id => {
    this.setState( prevState => ({
      isDetailsOn: { [id] : !prevState[id] && !this.state.isDetailsOn[id]}
    }));
  }


  async componentDidMount () {
    const api1 = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=btc"
    const api2 = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=ltc"
    const api3 = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=bch"
    const api4 = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=usdt"
    const host = "bravenewcoin-v1.p.rapidapi.com"
    const apikey = "63d0d8c04cmsh3f3f85efd15fb9dp1385a7jsnbb4c77f159d9"

    const btc = await fetch(api1, {
      "headers": { "x-rapidapi-host": host,"x-rapidapi-key": apikey }
    });

    const ltc = await fetch(api2, {
      "headers": { "x-rapidapi-host": host,"x-rapidapi-key": apikey }
    });
    
    const bch = await fetch(api3, {
      "headers": { "x-rapidapi-host": host,"x-rapidapi-key": apikey }
    });

    const usdt = await fetch(api4, {
      "headers": { "x-rapidapi-host": host,"x-rapidapi-key": apikey }
    });
  
    await Promise.all([btc,ltc,bch,usdt])
      .then ( cryptos => {
        return Promise.all(cryptos.map(r => r.json()));
      }).then(cryptos =>{
          console.log(cryptos);
          this.setState({cryptos: cryptos});
      })
      .catch(e => {

      });  
    
  }

  render() {
    const detailsOn = this.state.isDetailsOn;
    return (

      <div className="App">
       
        <header>
            <h1>Crypto Tracker</h1>
        </header>
      
        <div className="contain">
        {this.state.cryptos.map((crypto, key) => (
         
          <div className="crypt-container" id={crypto.coin_id} key={key}>
            <div className="maindata">
              <h2>{crypto.coin_name} | <span> {crypto.coin_id} </span></h2>

              <h2><NumberFormat value={crypto.last_price} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'}/></h2> 
            
                {detailsOn[key] ? 
            
                  <div className="details">
                    {/* Repeated data 
                    <h3>{crypto.coin_name} | <span> {crypto.coin_id} </span></h3>
                    <p><strong>Price:</strong> <NumberFormat value={crypto.last_price} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'$'}/></p> 
                     */}
                    <p><strong>24-Hour Volume:</strong> {crypto.volume_24hr}</p>
                    <p><strong>$100:</strong> <NumberFormat value={ 1 /crypto.last_price * 100 } displayType={'text'} decimalScale={4} /> </p> 
                    <p><strong>$250:</strong> <NumberFormat value={ 1 /crypto.last_price * 250 } displayType={'text'} decimalScale={4} /> </p>  
                    <p><strong>$5000:</strong> <NumberFormat value={ 1 /crypto.last_price * 5000 } displayType={'text'} decimalScale={4} />  </p> 
                  </div>
                : null
                }
     
              <button onClick={() => this.operation(key)} className="button">
                { detailsOn[key] ? 'Hide Details' : 'Show Details'} </button>

            </div>
          </div>
        ))}
       
       

        </div>
      </div>
      
    )
  }
}
export default App;

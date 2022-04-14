import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    //check if MetaMask exists
    if(typeof window.ethereum !== 'undefined'){
        const web3 = new Web3(window.ethereum);

        window.ethereum.enable().catch(error => {
          // User denied account access
          console.log(error);
        })

        const netId = await web3.eth.net.getId();
        // console.log("NetworkId: ", netId);
        const accounts = await web3.eth.getAccounts();
        // console.log('My Account: ', accounts[0]);

        // Load Balance
        if(typeof accounts[0] !== 'undefined'){
          const balance = await web3.eth.getBalance(accounts[0]);
          this.setState({ account: accounts[0], balance, web3: web3});
        }else{
          window.alert('Please Login with MetaMask');
        } 

        // Load Contracts
        try{
          //TOKEN
          const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);

          // fetching token balance to show in interest tab
          // const tokenBalance = await token.methods.balanceOf(this.state.account).call();
          // console.log("TOKEN BALANCE: ", tokenBalance);

          //DBANK
          const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);

          const dBankAddress = dBank.networks[netId].address;
          // console.log("DbankAddress: ", dBankAddress);

          this.setState({ token: token, dbank: dbank, dBankAddress: dBankAddress});
        } catch(error){
          // console.log("ERROR:", error);
          window.alert('Contracts not deployed to the current network');
        }

        // fetching token balance to show in interest tab
        // const tokenBalance = await token.methods.balanceOf(this.state.account).call();
        // console.log("TOKEN BALANCE: ", tokenBalance);
        
    }else{
      window.alert('Please install MetaMast');
    }
      
    //assign to values to variables: web3, netId, accounts

    //check if account is detected, then load balance&setStates, elsepush alert

    //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    console.log("Amount in deposit:", amount);
    //check if this.state.dbank is ok
    if(this.state.dbank !== 'undefined'){
      //in try block call dBank deposit();
      try{
        await this.state.dbank.methods.deposit().send({ value: amount.toString(), from: this.state.account })
      }catch(error){
        console.log("Error in Deposit", error);
      }
    }
    
      
  }

  async withdraw(e) {
    //prevent button from default click
    e.preventDefault();
    
    //check if this.state.dbank is ok
    if(this.state.dbank !== 'undefined'){
      //in try block call dBank withdraw();
      try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      }catch(error){
        console.log("Error in Withdraw", error);
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>WELCOME TO dBank</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center justify-content-center">
              <div className="content mr-auto ml-auto">
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  {/*add Tab deposit*/}
                  <Tab eventKey="deposit" title="Deposit">
                    <div>
                      <br/><br/>
                      How much do you wish to deposit?
                      <br/><br/>
                      (min. amount is 0.01 ETH)
                      <br/><br/>
                      (1 deposit is possible at a time)
                      <br/><br/>
                      <form onSubmit={(e) => {
                        // This prevents from page refresh
                        e.preventDefault();
                        let amount = this.depositAmount.value;

                        
                        //Convert to Wei
                        amount = amount * 10**18;

                        this.deposit(amount);
                      }}>
                        <div className='form-group mr-sm-2'>
                          <br/><br/>
                            <input
                              id="depositAmount"
                              step="0.01"
                              type="number"
                              className='form-control form-control-md'
                              placeholder='Amount...'
                              required
                              ref={(input) => { this.depositAmount = input }}
                            />
                        </div>
                        <button type="submit" className='btn btn-primary'>DEPOSIT</button>
                      </form>
                    </div>
                  </Tab>
                  {/*add Tab withdraw*/}
                  <Tab eventKey="withdraw" title="Withdraw">
                    <div>
                      <br/><br/>
                      Do you want to withdraw and take interest?
                      <br/><br/>
                      <br/><br/>
                      <div>
                        <button type="submit" className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
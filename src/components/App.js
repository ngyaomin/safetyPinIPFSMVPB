import React, { Component } from 'react';
import safetyPinLogo from '../safetyPin.png';
import './App.css';
import Web3 from 'web3';
import SafetyPinFile from '../abis/SafetyPinFile.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Wheres the fox')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = SafetyPinFile.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(SafetyPinFile.abi, networkData.address)
      this.setState({ contract })
      const safetyPinHash = await contract.methods.get().call()
      this.setState({ safetyPinHash })
    } else {
      window.alert('stupid contract not deployed to current network')
    }
    console.log(accounts)
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      buffer: null,
      contract: null,
      web3: null,
      safetyPinHash: ''
    }
  }



  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log("Pinning file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Pinning', result)

      if(error) {
        console.error(error)
        return
      }
      this.state.contract.methods.set(result[0].hash)
        .send({ from: this.state.account })
        .then((r) => {
          return this.setState({ safetyPinHash: result[0].hash })
        })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.stillthinking"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safety Pin Home
          </a>

          <ul className='navbar-nav px-3'>
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block"></li>
             <small className="text-white">{this.state.account}</small>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.safetyPinHash}`} className="App-logo" alt="logo" />
                </a>
                <h1>Safety Pin IPFS</h1>
                <p>&nbsp;</p>
                <h2>Upload your Documents here</h2>
                <form onSubmit={this.onSubmit} >
                  <input type="file" onChange={this.captureFile} />
                  <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

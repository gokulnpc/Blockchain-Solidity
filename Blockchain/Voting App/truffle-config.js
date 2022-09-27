module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  rinkeby: {
    host: "localhost",
    port: 8545,
    network_id: 4, // Match any network id
    gas: 4700000
  }
}
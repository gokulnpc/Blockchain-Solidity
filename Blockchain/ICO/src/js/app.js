App =
{
    loading: false,
    contracts: {},
    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    //https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    //loading web3
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }

        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        let accounts = await web3.eth.getAccounts();
        App.account = await accounts[0];
    },

    //loading all the contracts
    loadContract: async () => {
        //create a Javascript version of a contract
        const NPCToken = await $.getJSON('NPCToken.json');
        const NPCTokenSale = await $.getJSON('NPCTokenSale.json');
        App.contracts.NPCToken = TruffleContract(NPCToken);
        App.contracts.NPCTokenSale = TruffleContract(NPCTokenSale);
        App.contracts.NPCToken.setProvider(App.web3Provider);
        App.contracts.NPCTokenSale.setProvider(App.web3Provider);
        App.npcToken = await App.contracts.NPCToken.deployed();
        App.npcTokenSale = await App.contracts.NPCTokenSale.deployed();
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')

        if (boolean) {
            loader.show()
            content.hide()
        }
        else {
            loader.hide()
            content.show()
        }
    },

    render: async () => {
        //to prevent double rendering
        if (App.loading) {
            return
        }

        App.setLoading(true)

        //$('#account').html(App.account)

        //render 
        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async () => {

        //load token price
        const price = await App.npcTokenSale.tokenPrice();
        const npcBalance = await App.npcToken.balanceOf(App.account);
        const tokensSold = await App.npcTokenSale.tokensSold();
        const tokensAvailable = await App.npcToken.totalSupply();

        // console.log(App.account);
        // console.log(price.toNumber());
        // console.log(npcBalance.toNumber());

        $('.token-price').html(price.toNumber());
        $('.npc-balance').html(npcBalance.toNumber());
        $('.tokens-sold').html(tokensSold.toNumber());
        $('.tokens-available').html(tokensAvailable.toNumber());
    },

    buyTokens: async () => {
        const numberOfTokens = $('#numberOfTokens').val();
        await App.npcTokenSale.buyTokens(numberOfTokens, { from: App.account });
        window.location.reload()
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
});
App =
{
    web3Provider: null,
    account: 0x0,
    tokenSold: 0,
    tokensAvailable: 750000,
    tokenPrice: 1000000000000000,
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
        $('#accountAddress').html("Your account: " + App.account);
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
        App.tokenPrice = await App.npcTokenSale.tokenPrice();
        const npcBalance = await App.npcToken.balanceOf(App.account);
        App.tokensSold = await App.npcTokenSale.tokensSold();

        // console.log(App.account);
        // console.log(price.toNumber());
        // console.log(npcBalance.toNumber());

        $('.token-price').html(App.tokenPrice.toNumber() / 1000000000000000000);
        $('.npc-balance').html(npcBalance.toNumber());
        $('.tokens-sold').html(App.tokensSold.toNumber());
        $('.tokens-available').html(App.tokensAvailable);

        var progressPercent = (App.tokensSold.toNumber() / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + "%");
    },

    buyTokens: async () => {
        const numberOfTokens = $('#numberOfTokens').val();
        console.log(App.account);
        await App.npcTokenSale.buyTokens(numberOfTokens, {
            from: App.account,
            value: numberOfTokens * App.tokenPrice,
            gas: 500000 // Gas limit
        });
        $('form').trigger('reset');
        window.location.reload()
    },

}

$(() => {
    $(window).load(() => {
        App.load()
    })
});

//note
// ganache first account deployed the contract so it will hold all 1 million tokens
// and it will be admin
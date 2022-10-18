App =
{
    web3Provider: null,
    account: 0x0,
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
        const Election = await $.getJSON('Election.json');
        App.contracts.Election = TruffleContract(Election);
        App.contracts.Election.setProvider(App.web3Provider);
        App.Election = await App.contracts.Election.deployed();
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

        //render
        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async () => {

        //load token price
        App.candidatesCount = await App.Election.candidateCount();
        // console.log(App.candidateCount.toNumber());

        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        App.Election.voters(App.account).then(function (check) {
            if (check == true) {
                $("form").hide();
                $('#success').show();
            }
        });

        for (var i = 1; i <= App.candidatesCount; i++) {
            App.Election.candidates(i).then(function (candidate) {
                var id = candidate[0].toNumber();
                var name = candidate[1];
                var voteCount = candidate[2];

                // Render candidate Result
                var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                candidatesResults.append(candidateTemplate);

                // Render candidate ballot option
                var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
                candidatesSelect.append(candidateOption);
            });
        }



    },

    castVote: async () => {
        var candidateId = $('#candidatesSelect').val()
        App.contracts.Election.deployed().then(function (instance) {
            return instance.vote(candidateId, { from: App.account });
        }).then(function (result) {
            // Wait for votes to update
            window.location.reload();
        }).catch(function (err) {
            console.error(err);
        });
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
});

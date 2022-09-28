var Election = artifacts.require("./Election.sol");

contract('Election', function (accounts) {
    var tokenInstance;

    it('it initalizes with two candidates', function () {
        return Election.deployed().then(function (instance) {
            return instance.candidateCount();
        }).then(function (count) {
            assert.equal(count, 2);
        });
    });

    it("it initializes candidates with correct values", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.candidates(1)
        }).
            then(function (x) {
                assert.equal(x[0], 1, "contains correct id");
                assert.equal(x[1], "Candidate 1", "contains correct name");
                assert.equal(x[2], 0, "contains correct vote count");
                return electionInstance.candidates(2);
            }).then(function (x) {
                assert.equal(x[0], 2, "contains correct id");
                assert.equal(x[1], "Candidate 2", "contains correct name");
                assert.equal(x[2], 0, "contains correct vote count");
            });
    });

    it("it allows the user to cast a vote", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.vote(1, { from: accounts[0] });
        }).then(function (receipt) {
            return electionInstance.voters(accounts[0]);
        }).then(function (voted) {
            assert.equal(voted, true, "the voter was marked as voted");
            return electionInstance.candidates(1);
        }).then(function (candidate) {
            var count = candidate[2];
            assert.equal(count, 1, "increments the candidate's vote count");
        });
    });

    it("throws an exception for invalid candiates", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function (candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function (candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
    });

    it("throws an exception for double voting", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, { from: accounts[1] });
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote");
            // Try to vote again
            return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function (candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function (candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
    });
});
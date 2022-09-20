const NPCToken = artifacts.require('./NPCToken.sol')

contract('NPCToken', (accounts) => {
    before(async () => {
        this.npcToken = await NPCToken.deployed()
    })

    it('sets total supply upon deployment', async () => {
        const totalSupply = await this.npcToken.totalSupply()
        assert.equal(totalSupply, 1000000)
    })

    // it('lists tasks', async () => {
    //     const taskCount = await this.todoList.taskCount()
    //     const task = await this.todoList.tasks(taskCount)
    //     assert.equal(task.id.toNumber(), taskCount.toNumber())
    //     assert.equal(task.content, 'Check out dappuniversity.com')
    //     assert.equal(task.completed, false)
    //     assert.equal(taskCount.toNumber(), 1)
    // })

    // it('creates tasks', async () => {
    //     const result = await this.todoList.createTask('A new task')
    //     const taskCount = await this.todoList.taskCount()
    //     assert.equal(taskCount, 2)
    //     const event = result.logs[0].args
    //     assert.equal(event.id.toNumber(), 2)
    //     assert.equal(event.content, 'A new task')
    //     assert.equal(event.completed, false)
    // })

    // it('toggles task completion', async () => {
    //     const result = await this.todoList.toggleCompleted(1)
    //     const task = await this.todoList.tasks(1)
    //     assert.equal(task.completed, true)
    //     const event = result.logs[0].args
    //     assert.equal(event.id.toNumber(), 1)
    //     assert.equal(event.completed, true)
    // })

})
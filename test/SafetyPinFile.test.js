const SafetyPinFile = artifacts.require('SafetyPinFile');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SafetyPinFile', (accounts) => {
  let safetyPinFile

  before(async () => {
    safetyPinFile = await SafetyPinFile.deployed()
  })

  describe('deployment', async () => {

    it('deploys successfully', async () =>  {
      const address = safetyPinFile.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('storage', async () => {
    it('updates the safetyPinHash', async () => {
      let safetyPinHash
      safetyPinHash = 'test123'
      await safetyPinFile.set(safetyPinHash)
      const  result = await safetyPinFile.get()
      assert.equal(result, safetyPinHash)
    })
  })
})

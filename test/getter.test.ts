import Lib from '../src/lib'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fs from 'fs'
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Get...() Function Tests', function() {
	it('Get IP Addresses from File', async function() {
		const fInput = { AddressList: ['8.8.8.8', '8.8.4.4'] }
		fs.writeFileSync('./testfile.json', JSON.stringify(fInput))
		const libx = new Lib(true)
		const result = await libx.getIPAddressesFromFile('./testfile.json')
		expect(result.AddressList[0]).equals(fInput.AddressList[0])
		expect(result.AddressList[1]).equals(fInput.AddressList[1])
		fs.unlinkSync('./testfile.json')
	})

	it('Should throw Error when reading from non-existing File', async function() {
		const fInput = { AddressList: ['8.8.8.8', '8.8.4.4'] }
		fs.writeFileSync('./testfile.json', JSON.stringify(fInput))
		const libx = new Lib(true)
		await expect(libx.getIPAddressesFromFile('./testfile1.json1')).to.be
			.rejected
	})

	it('Read from Argv', async function() {
		const libx = new Lib(true)
		const input = '8.8.8.8,8.8.4.4'
		process.argv['hosts'] = input
		const result = libx.getIpAddressesFromArgs()
		expect(result.AddressList.join(',')).equals(input)
	})
})

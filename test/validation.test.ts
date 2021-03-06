import Lib, { IpAddressList } from '../src/lib'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('Data Validation', function() {
	it('IP should be marked invalid', function() {
		const invalidIp = '3453.3421..22.3'
		const libx = new Lib(true)
		const result = libx.validateIp(invalidIp)
		expect(result).equals(false)
	})

	it('IP should be marked valid', function() {
		const validIp = '8.8.8.8'
		const libx = new Lib(true)
		const result = libx.validateIp(validIp)
		expect(result).equals(true)
	})

	it('IP Validation should throw error', function() {
		const ip = ''
		const libx = new Lib(true)
		expect(libx.validateIp(ip)).equals(false)
	})

	it('startLib() with invalid IP', async function() {
		const libx = new Lib(true)
		const addressList: IpAddressList = { AddressList: ['555.666.777.888'] }
		const result = await libx.startLib(addressList)
		expect(result).equals({})
	})
})

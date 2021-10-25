import lib from '../src/lib'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Data Validation', function()
{
    it('IP should be marked invalid', function()
    {
        const invalidIp = '3453.3421..22.3'
        const libx = new lib(true)
        const result = libx.ValidateIp(invalidIp)
        expect(result).equals(false)
    })

    it('IP should be marked valid', function()
    {
        const validIp = '8.8.8.8'
        const libx = new lib(true)
        const result = libx.ValidateIp(validIp)
        expect(result).equals(true)
    })

    it('IP Validation should throw error', function()
    {
        const ip = ''
        const libx = new lib(true)
        expect(libx.ValidateIp(ip)).equals(false)
    })
})
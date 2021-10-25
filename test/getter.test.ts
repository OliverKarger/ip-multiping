import lib from '../src/lib'
import fs from 'fs';
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Get...() Function Tests', function()
{
    it('Get IP Addresses from File', async function()
    {
        const fInput = { AddressList: ['8.8.8.8', '8.8.4.4'] }
        fs.writeFileSync('./testfile.json', JSON.stringify(fInput))
        const libx = new lib(true)
        var result = await libx.GetIPAddressesFromFile('./testfile.json')
        expect(result.AddressList[0]).equals(fInput.AddressList[0])
        expect(result.AddressList[1]).equals(fInput.AddressList[1])
        fs.unlinkSync('./testfile.json')
    })

    it('Should throw Error when reading from non-existing File', async function()
    {
        const fInput = { AddressList: ['8.8.8.8', '8.8.4.4'] }
        fs.writeFileSync('./testfile.json', JSON.stringify(fInput))
        const libx = new lib(true)
        await expect(libx.GetIPAddressesFromFile('./testfile1.json1')).to.be.rejected
    })

    it('Read from Argv', async function()
    {
        const libx = new lib(true)
        const input = '8.8.8.8,8.8.4.4'
        process.argv["hosts"] = input
        const result = libx.GetIpAddressesFromArgs()
        expect(result.AddressList.join(',')).equals(input)
    })
})
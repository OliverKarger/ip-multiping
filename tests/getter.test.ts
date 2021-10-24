import lib from '../src/lib'
import { expect } from 'chai'
import fs from 'fs';

describe('Get...() Function Tests', function()
{
    it('Get IP Addresses from File', async function()
    {
        /* Create Test File to File */
        const fInput = { AddressList: ['8.8.8.8', '8.8.4.4'] }
        fs.writeFileSync('./testfile.json', JSON.stringify(fInput))
        const libx = new lib()
        var result = await libx.GetIPAddressesFromFile('./testfile.json')
        expect(result.AddressList[0]).equals(fInput.AddressList[0])
        expect(result.AddressList[1]).equals(fInput.AddressList[1])
        fs.unlinkSync('./testfile.json')
    })
})
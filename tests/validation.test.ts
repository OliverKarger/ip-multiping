import lib from '../src/lib'
import { expect } from 'chai'

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
})
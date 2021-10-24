import lib, { IpAddressList } from '../src/lib'
import { expect } from 'chai'

describe('Ping Tests', function()
{
    it('Single IP should be alive', async function()
    {
        const ipAddresses: IpAddressList = { AddressList: ['8.8.8.8'] }
        const libx = new lib()
        const results = await libx.StartLib(ipAddresses)

        expect(results['8.8.8.8']).equals(true)
    }).timeout(10000)

    it('Multiple IPs should be alive', async function()
    {
        const ipAddresses: IpAddressList = { AddressList: ['8.8.8.8', '8.8.4.4'] }
        const libx = new lib()
        const results = await libx.StartLib(ipAddresses)

        expect(results['8.8.8.8']).equals(true)
        expect(results['8.8.4.4']).equals(true)
    }).timeout(10000)

    it('Single IP should be dead', async function()
    {
        const ipAddresses: IpAddressList = { AddressList: ['192.0.2.0'] }
        const libx = new lib()
        const results = await libx.StartLib(ipAddresses)

        expect(results['192.0.2.0']).equals(false)
    }).timeout(10000)

    it('Multiple IPs should be dead', async function()
    {
        const ipAddresses: IpAddressList = { AddressList: ['192.0.2.0', '198.51.100.0', '203.0.113.0'] }
        const libx = new lib()
        const results = await libx.StartLib(ipAddresses)

        expect(results['192.0.2.0']).equals(false)
        expect(results['198.51.100.0']).equals(false)
        expect(results['203.0.113.0']).equals(false)
    }).timeout(10000)

    it('Mixing dead and alive IP Addresses', async function()
    {
        const ipAddresses: IpAddressList = { AddressList: ['8.8.8.8', '8.8.4.4', '192.0.2.0'] }
        const libx = new lib()
        const results = await libx.StartLib(ipAddresses)

        expect(results['8.8.8.8']).equals(true)
        expect(results['8.8.4.4']).equals(true)
        expect(results['192.0.2.0']).equals(false)
    }).timeout(10000)
})
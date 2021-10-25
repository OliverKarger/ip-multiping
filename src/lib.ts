const { prompt, Select } = require('enquirer')
import validateIP from 'validate-ip-node'
import * as ping from 'ping'
import * as fs from 'fs'
import signale, { DefaultMethods } from 'signale'

/**
 * @OliverKarger
 * @description Type for return value of GetIpAdresses()
 * @version 1.0
 * @type Type
 * @copyright 2021 (C) Oliver Karger / Infernitas SE
 */
export type IpAddressList = { AddressList: string[] }


export default class IpMultipingLib 
{

    public help = `
--------
- HELP -
--------

1. CLI
 -> Input IP-Addresses via Console

2. Params/Args
 -> Input IP-Addresses via Args, comma seperated
 Example: ./<source-file> --hosts Address1,Address2,Address2

3. File
 -> Load IP-Addresses from File
 Example: (hosts.json)
    {
        'AddressList: [
            '10.0.0.1',
            '192.168.1.1',
            '172.16.0.1',
            '8.8.8.8',
            '8.8.4.4',
            '1.1.1.1'
        ]
    }
`

    public log: signale.Signale<DefaultMethods> = new signale.Signale()

    /**
     * @OliverKarger
     * @description Gets IP Addresses from a File
     * @version 1.0
     * @param {string} path Filepath
     * @type Function
     * @copyright 2021 (C) Oliver Karger / Infernitas SE
     */
    public async GetIPAddressesFromFile(path?: string): Promise<IpAddressList>
    {
        return new Promise((resolve, reject) => 
        {
            try 
            {
                resolve(JSON.parse(fs.readFileSync(path).toString()))
            } 
            catch (e) {
                reject(e)
            }
        })
    }

    /**
     * @OliverKarger
     * @description Gets IP Addresses from a Process Args
     * @version 1.0
     * @type Function
     * @copyright 2021 (C) Oliver Karger / Infernitas SE
     */
    public GetIpAddressesFromArgs(): IpAddressList
    {
        return { AddressList: process.argv["hosts"].split(',') }
    }

    /**
     * @OliverKarger
     * @description Validate IP and catch Error
     * @version 1.0
     * @param {string} ipAddress IP Address String to be validated
     * @type Function
     * @copyright 2021 (C) Oliver Karger / Infernitas SE
     */
    public ValidateIp(ipAddress): boolean
    {
        if(validateIP(ipAddress))
        {
            return true
        }
        else 
        {
            return false
        }
    }

    /**
     * @OliverKarger
     * @description Main Method
     * @version 1.0
     * @param {IpAddressList} libAddressList Address List if App is executed from a extern Source
     * @type Function
     * @copyright 2021 (C) Oliver Karger / Infernitas SE
     */
    public async StartLib(ipAddressList: IpAddressList)
    {
        var resultDic: { [id: string] : boolean; } = {};
        await Promise.all( /* For some reason, AddressList.ForEach cannot be used here. */
            ipAddressList.AddressList.map(async (ipAddress) => 
            {
                if(this.ValidateIp(ipAddress))
                {
                    const status = await ping.promise.probe(ipAddress)
                    if(status.alive)
                    {
                        resultDic[ipAddress] = true
                    }
                    else 
                    {
                        resultDic[ipAddress] = false
                    }
                }
            })
        )
        return resultDic
    }

    /**
     * @OliverKarger
     * @description Class Constructior
     * @version 1.0
     * @type Constructor
     * @copyright 2021 (C) Oliver Karger / Infernitas SE
     */
    public constructor(isTesting?: boolean)
    {
        this.log.config({
            displayBadge: true,
            displayFilename: true, 
            displayTimestamp: true
        })
        if(isTesting)
        {
            this.log.disable()
        }
    }
}

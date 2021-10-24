const { prompt, Select } = require('enquirer')
import validateIP from 'validate-ip-node'
import * as ping from 'ping'
import { exec } from 'child_process'
import signale, { DefaultMethods, SignaleConfig } from 'signale'
import * as fs from 'fs'
import { main } from 'figures'

/* 
 * Signale Logger
 */ 
const log: signale.Signale<DefaultMethods> = new signale.Signale();
log.config({
    displayBadge: true,
    displayFilename: true, 
    displayTimestamp: true
})

const help = `
--------
- HELP -
--------

1. CLI
 -> Input IP-Addresses via Console

2. Params/Args
 -> Input IP-Addresses via Args, comma seperated
 Example: ./<source-file> Address1,Address2,Address2

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

/**
 * @OliverKarger
 * @description Type for return value of GetIpAdresses()
 * @version 1.0
 * @created 14:15 24.10.2021
 * @lastChanged 14:15 24.10.2021
 * @type Type
 * @copyright 2021 (C) Oliver Karger / Infernitas SE
 */
type IpAddressList = { AdressList: string[] }

/**
 * @OliverKarger
 * @description Creates String from IpAddressList.AddressList
 * @version 1.0
 * @created 14:18 24.10.2021
 * @lastChanged 14:19 24.10.2021
 * @type Function
 * @copyright 2021 (C) Oliver Karger / Infernitas SE
 */
function GetIpAddressString(input: IpAddressList)
{
    return input.AdressList.join(',')
}

/**
 * @OliverKarger
 * @description Gets IP Addresses from a File
 * @version 1.0
 * @created 14:25 24.10.2021
 * @lastChanged 14:27 24.10.2021
 * @type Function
 * @copyright 2021 (C) Oliver Karger / Infernitas SE
 */
async function GetIPAddressesFromFile()
{
    log.info('Current Location: ' + process.cwd())
    const filePath = await prompt({
        type: 'input',
        name: 'path',
        message: 'Please Enter Path to Host File (.json)',
    })
    try {
        return JSON.parse(fs.readFileSync(filePath.path).toString())
    } catch (e) {
        log.fatal(new Error(e))
    }
}

function GetIpAddressesFromArgs()
{
    return { AdressList: process.argv.slice(2)[0].split(',') }
}

async function GetIpAdressesFromCLI()
{
    const cliPromptResult = await prompt({
        type: 'input',
        name: 'AddressList',
        message: 'IP-Addresses',
    })
    // Split string for correct format
    return cliPromptResult.AddressList.split(',')

}

/**
 * @OliverKarger
 * @description Gets IP Addresses from User / File
 * @version 1.0
 * @created 14:19 24.10.2021
 * @lastChanged 14:19 24.10.2021
 * @type Function
 * @copyright 2021 (C) Oliver Karger / Infernitas SE
 */
async function GetIpAddresses()
{
    log.await('Please Select your preferred way to input data...')
    // Result
    let ipAddressList: IpAddressList = { AdressList: [] }
    // Menu Prompt
    const inputPrompt = new Select({
        name: 'Action',
        message: 'Your Choice',
        choices: [ 'CLI', 'Params', 'File', 'Help' ]
    })
    const inputPromptResult = await inputPrompt.run().catch(e => log.fatal(new Error(e)))
    if(inputPromptResult === 'CLI')
    {
        ipAddressList = await GetIpAdressesFromCLI()
    }
    else if (inputPromptResult === 'Params')
    {
        ipAddressList = GetIpAddressesFromArgs()
    }
    else if (inputPromptResult === 'File')
    {
        ipAddressList = await GetIPAddressesFromFile()
    } 
    else if (inputPromptResult === 'Help')
    {
        log.info('\n' + help)
    }
    else 
    {
		log.fatal(new Error('Invalid Prompt Result!'))
    }
}

async function ValidateIp(ipAddress)
{
    return await validateIP(ipAddress)
}

/**
 * @OliverKarger
 * @description Main Method
 * @version 1.0
 * @created 14:32 24.10.2021
 * @lastChanged 14:32 24.10.2021
 * @type Function
 * @copyright 2021 (C) Oliver Karger / Infernitas SE
 */
async function Main()
{
    const addresses = await GetIpAddresses()
}

try 
{
    Main()
} 
catch (e)
{
    log.fatal(e)
}

exec('pause');
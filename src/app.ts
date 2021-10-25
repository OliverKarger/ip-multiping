import { exec } from "child_process"
import IpMultipingLib, { IpAddressList } from "./lib"
const { prompt, Select } = require('enquirer')

const lib = new IpMultipingLib()

async function main()
{
    let log = lib.log
    let ipAddressList: IpAddressList = { AddressList: [] }
    // Menu Prompt
    const inputPrompt = new Select({
        name: 'Action',
        message: 'How to you want to Input the IP Addresses ?',
        choices: [ 'CLI', 'Args', 'File', 'Help' ]
    })
    const inputPromptResult = await inputPrompt.run().catch(e => log.warn(e))
    if(inputPromptResult === 'CLI')
    {
        const cliPromptResult = await prompt({
            type: 'input',
            name: 'AddressList',
            message: 'IP-Addresses',
        })
        ipAddressList = { AddressList: cliPromptResult.AddressList.split(',') }
    }
    else if (inputPromptResult === 'Args')
    {
        ipAddressList = lib.GetIpAddressesFromArgs()
    }
    else if (inputPromptResult === 'File')
    {
        ipAddressList = await lib.GetIPAddressesFromFile()
    } 
    else if (inputPromptResult === 'Help')
    {
        log.info('\n' + lib.help)
    }
    else 
    {
        log.warn('Invalid Prompt Result!')
    }
    ipAddressList.AddressList.forEach(ip => lib.ValidateIp(ip))
    lib.StartLib(ipAddressList)
}

main()

exec('pause')
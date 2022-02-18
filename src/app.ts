import IpMultipingLib, { IpAddressList } from './lib'

import { exec } from 'child_process'

const { prompt, Select } = require('enquirer')

const lib = new IpMultipingLib()

async function main() {
	const log = lib.log
	let ipAddressList: IpAddressList = { AddressList: [] }
	// Menu Prompt
	const inputPrompt = new Select({
		name: 'Action',
		message: 'How to you want to Input the IP Addresses ?',
		choices: ['CLI', 'Args', 'File', 'Help'],
	})
	const inputPromptResult = await inputPrompt.run().catch((e) => log.warn(e))
	if (inputPromptResult === 'CLI') {
		const cliPromptResult = await prompt({
			type: 'input',
			name: 'AddressList',
			message: 'IP-Addresses',
		})
		ipAddressList = { AddressList: cliPromptResult.AddressList.split(',') }
	} else if (inputPromptResult === 'Args') {
		ipAddressList = lib.getIpAddressesFromArgs()
	} else if (inputPromptResult === 'File') {
		ipAddressList = await lib.getIPAddressesFromFile()
	} else if (inputPromptResult === 'Help') {
		log.info('\n' + lib.help)
	} else {
		log.warn('Invalid Prompt Result!')
	}
	ipAddressList.AddressList.forEach((ip) => lib.validateIp(ip))
	lib.startLib(ipAddressList)
}

main()

exec('pause')

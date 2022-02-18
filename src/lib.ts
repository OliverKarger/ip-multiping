import * as fs from 'fs'
import * as ping from 'ping'

import signale, { DefaultMethods } from 'signale'

import validateIP from 'validate-ip-node'

export type IpAddressList = { AddressList: string[] }

export default class IpMultipingLib {
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

	public async getIPAddressesFromFile(path?: string): Promise<IpAddressList> {
		return new Promise((resolve, reject) => {
			try {
				resolve(JSON.parse(fs.readFileSync(path).toString()))
			} catch (e) {
				reject(e)
			}
		})
	}

	public getIpAddressesFromArgs(): IpAddressList {
		return { AddressList: process.argv['hosts'].split(',') }
	}

	public validateIp(ipAddress): boolean {
		return validateIP(ipAddress)
	}

	public async startLib(ipAddressList: IpAddressList) {
		const resultDic: { [id: string]: boolean } = {}
		await Promise.all(
			/* For some reason, AddressList.ForEach cannot be used here. */
			ipAddressList.AddressList.map(async (ipAddress) => {
				if (this.validateIp(ipAddress)) {
					const status = await ping.promise.probe(ipAddress)
					resultDic[ipAddress] = status.alive ? true : false
				}
			}),
		)
		return resultDic
	}

	public constructor(isTesting?: boolean) {
		this.log.config({
			displayBadge: true,
			displayFilename: true,
			displayTimestamp: true,
		})
		if (isTesting) {
			this.log.disable()
		}
	}
}

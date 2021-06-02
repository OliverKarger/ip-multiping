import {prompt, Select} from 'enquirer'; // ! IntelliSense says that there is no member to export, but thats not true
import validateIP from 'validate-ip-node';
import * as ping from 'ping';
import {exec} from 'child_process';
import signale, {DefaultMethods, SignaleConfig} from 'signale';
import * as fs from 'fs';

const signaleConfiguration: SignaleConfig = {
	displayBadge: true,
	displayFilename: true,
	displayTimestamp: true,
};
const logger: signale.Signale<DefaultMethods> = new signale.Signale();
logger.config(signaleConfiguration);

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
`;

/**
 * @author Oliver Karger
 * @description Contains Data returned from 'GetIpAddresses()'
 */
type IpAddressList = {
	AddressList: string[];
};

/**
 * @author Oliver Karger
 * @description Contains Data Return from FilePathInputPrompt
 */
type filePathPromptResult = {
	path: string;
};

/**
 * @author Oliver Karger
 * @description AddressList by prompt(...); as String, needs to be .split(',') to convert to IpAddressList
 */
type IpAddressListString = {
	AddressList: string;
};

/**
 * @author Oliver Karger
 * @description Get IP Addresses from User
 * @return {Promise<IpAddressList>} Object from Type: IpAddressList
 */
async function getIpAddresses(): Promise<IpAddressList> {
	logger.await('Please select your preferred Way to input Data');
	// Response Variable
	let response: IpAddressList = {AddressList: []};
	// Input Prompt
	const inputPrompt = new Select({
		name: 'Action',
		message: 'Your way:',
		choices: ['CLI', 'Params/Args', 'File', 'Help'],
	});
	const InputPromptResult: string = await inputPrompt
		.run()
		.catch((e) => logger.fatal(new Error(e)));
	if (InputPromptResult === 'File') {
		logger.info('Current Location: ' + process.cwd());
		const filePath: filePathPromptResult = await prompt({
			type: 'input',
			name: 'path',
			message: 'Please Enter Path to Host File (.json)',
		});
		try {
			response = JSON.parse(fs.readFileSync(filePath.path).toString());
		} catch (e) {
			logger.fatal(new Error(e));
		}
	} else if (InputPromptResult === 'Params/Args') {
		// removes first 2 items (default nodejs args), formatts for correct format
		response.AddressList = process.argv.slice(2)[0].split(',');
	} else if (InputPromptResult === 'CLI') {
		// ! Returns single string, has to be splitted
		const cliPromptResult: IpAddressListString = await prompt({
			type: 'input',
			name: 'AddressList',
			message: 'IP-Addresses',
		});
		// ! Split string for correct format
		response.AddressList = cliPromptResult.AddressList.split(',');
	} else if (InputPromptResult === 'Help') {
		logger.info('\n' + help);
	} else {
		logger.fatal(new Error('Invalid Prompt Result!'));
	}
	return response;
}

/**
 * @author Oliver Karger
 * @description Main Method
 */
async function main(): Promise<void> {
	// Get IP Addresses from User
	const IpAddressInput = await getIpAddresses();
	await Promise.all(
		IpAddressInput.AddressList.map(async (IpAddress) => {
			// Validate
			if (await validateIP(IpAddress)) {
				// IP Address is valid
				logger.info(`IP-Address: ${IpAddress} is valid`);
				const status = await ping.promise
					.probe(IpAddress)
					.catch((e) => logger.fatal(new Error(e)));
				if (status.alive) {
					logger.success(`IP-Address: ${IpAddress} is alive!`);
				} else {
					logger.warn(`IP-Address: ${IpAddress} is dead!`);
				}
			} else {
				// IP Address is invalid
				logger.warn(`IP-Address: ${IpAddress} is invalid!`);
			}
		}),
	);
}

// * Call Main Method - has to be on the bottom of the code
main().catch((e) => {
	logger.fatal(new Error(e));
});

// * Keep Console open
exec('pause');

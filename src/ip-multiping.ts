import { prompt, Select } from 'enquirer'; // ! IntelliSense says that there is no member to export, but thats not true
import validateIP from 'validate-ip-node';
import * as ping from 'ping';
import { exec } from 'child_process';
import { writeInfo, writeWarning, writeSuccess, writeRequest, writeError, header } from './ArtemisCLI';
import * as fs from 'fs';

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
 * @description AddressList by prompt(...); as String, needs to be .split(',') to convert to IpAddressList
 */
type IpAddressListString = {
    AddressList: string;
};

/**
 * @author Oliver Karger
 * @description Get IP Addresses from User
 * @returns Object from Type: IpAddressList
 */
async function getIpAddresses(): Promise<IpAddressList> {
    'use strict';
    writeRequest('Please select your preferred Way to input Data');
    // Response Variable
    let response: IpAddressList = { AddressList: [] };
    // Input Prompt
    const inputPrompt = new Select({
        name: 'Action',
        message: 'Your way:',
        choices: ['CLI', 'Params/Args', 'File', 'Help'],
    });
    const InputPromptResult: string = await inputPrompt.run().catch((e) => writeError(e));
    if (InputPromptResult === 'File') {
        writeInfo('Current Location: ' + process.cwd());
        const filePath = await prompt({
            type: 'input',
            name: 'path',
            message: 'Please Enter Path to Host File (.json)',
        });
        try {
            response = JSON.parse(fs.readFileSync(filePath.path));
        } catch (e) {
            writeError(e);
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
        writeInfo('\n' + help);
    } else {
        writeError('Invalid Prompt Result!');
    }
    return response;
}

// Display ArtemisCLI header
header();

/**
 * @author Oliver Karger
 * @description Main Method
 */
async function main(): Promise<void> {
    'use strict';
    // Get IP Addresses from User
    const IpAddressInput = await getIpAddresses();
    await Promise.all(
        IpAddressInput.AddressList.map(async (IpAddress) => {
            // Validate
            if (await validateIP(IpAddress)) {
                // IP Address is valid
                writeInfo(`IP-Address: ${IpAddress} is valid`);
                const status = await ping.promise.probe(IpAddress).catch((e) => writeError(e));
                if (status.alive) {
                    writeSuccess(`IP-Address: ${IpAddress} is alive!`);
                } else {
                    writeWarning(`IP-Address: ${IpAddress} is dead!`);
                }
            } else {
                // IP Address is invalid
                writeWarning(`IP-Address: ${IpAddress} is invalid!`);
            }
        })
    );
}

// * Call Main Method - has to be on the bottom of the code
main().catch((e) => {
    'use strict';
    writeError(e);
});

// * Keep Console open
exec('pause');

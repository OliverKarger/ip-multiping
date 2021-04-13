import { prompt, Select } from "enquirer"; // ! IntelliSense says that there is no member to export, but thats not true
import validateIP from "validate-ip-node";
import * as ping from "ping";
import { exec } from "child_process";
import { WriteInfo, WriteWarning, WriteSuccess, WriteRequest, WriteError, Header } from "./ArtemisCLI";
import * as fs from "fs";

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
        "AddressList: [
            "10.0.0.1",
            "192.168.1.1",
            "172.16.0.1",
            "8.8.8.8",
            "8.8.4.4",
            "1.1.1.1"
        ]
    }
`;

/**
 * @author Oliver Karger
 * @description Contains Data returned from "GetIpAddresses()"
 */
type IpAddressList = {
    AddressList: string[];
};

/**
 * @author Oliver Karger
 * @description AddressList by prompt(...); as String, needs to be .split(",") to convert to IpAddressList
 */
type IpAddressListString = {
    AddressList: string;
};

/**
 * @author Oliver Karger
 * @description Get IP Addresses from User
 * @returns Object from Type: IpAddressList
 */
async function GetIpAddresses(): Promise<IpAddressList> {
    WriteRequest("Please select your preferred Way to input Data");
    // Response Variable
    var response: IpAddressList = { AddressList: [] };
    // Input Prompt
    var inputPrompt = new Select({
        name: "Action",
        message: "Your way:",
        choices: ["CLI", "Params/Args", "File", "Help"],
    });
    let InputPromptResult: string = await inputPrompt.run().catch((e) => WriteError(e));
    if (InputPromptResult === "File") {
        WriteInfo("Current Location: " + process.cwd());
        let filePath = await prompt({
            type: "input",
            name: "path",
            message: "Please Enter Path to Host File (.json)",
        });
        try {
            response = JSON.parse(fs.readFileSync(filePath.path));
        } catch (e) {
            WriteError(e);
        }
    } else if (InputPromptResult === "Params/Args") {
        // removes first 2 items (default nodejs args), formatts for correct format
        response.AddressList = process.argv.slice(2)[0].split(",");
    } else if (InputPromptResult === "CLI") {
        // ! Returns single string, has to be splitted
        var cliPromptResult: IpAddressListString = await prompt({
            type: "input",
            name: "AddressList",
            message: "IP-Addresses",
        });
        // ! Split string for correct format
        response.AddressList = cliPromptResult.AddressList.split(",");
    } else if (InputPromptResult === "Help") {
        WriteInfo("\n" + help);
    } else {
        WriteError("Invalid Prompt Result!");
    }
    return response;
}

// Display ArtemisCLI Header
Header();

/**
 * @author Oliver Karger
 * @description Main Method
 */
async function main(): Promise<void> {
    // Get IP Addresses from User
    var IpAddressInput = await GetIpAddresses();
    await Promise.all(
        IpAddressInput.AddressList.map(async (IpAddress) => {
            // Validate
            if (await validateIP(IpAddress)) {
                // IP Address is valid
                WriteInfo(`IP-Address: ${IpAddress} is valid`);
                let status = await ping.promise.probe(IpAddress).catch((e) => WriteError(e));
                if (status.alive) {
                    WriteSuccess(`IP-Address: ${IpAddress} is alive!`);
                } else {
                    WriteWarning(`IP-Address: ${IpAddress} is dead!`);
                }
            } else {
                // IP Address is invalid
                WriteWarning(`IP-Address: ${IpAddress} is invalid!`);
            }
        })
    );
}

// * Call Main Method - has to be on the bottom of the code
main().catch((e) => WriteError(e));

// * Keep Console open
exec("pause");

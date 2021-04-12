var { Select, prompt } = require("enquirer");
var validateIP = require("validate-ip-node");
var ping = require("ping");
var { exec } = require("child_process");
var { WriteInfo, WriteWarning, WriteSuccess, WriteRequest, WriteError, Header } = require("./ArtemisCLI");
var chalk = require("chalk");
var fs = require("fs");

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
        choices: ["File", "Params/Args", "CLI"],
    });
    let InputPromptResult = await inputPrompt.run();
    if (InputPromptResult === "File") {
        WriteInfo("Current Location: " + process.cwd());
        let filePath = await prompt({
            type: "input",
            name: "path",
            message: "Please Enter Path to Host File (.json)",
        });
        try {
            let rawData = fs.readFileSync(filePath.path);
            let hostsData = JSON.parse(rawData);
            response = hostsData;
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
    console.log(IpAddressInput);
    await Promise.all(
        IpAddressInput.AddressList.map(async (IpAddress) => {
            // Validate
            if (await validateIP(IpAddress)) {
                // IP Address is valid
                WriteInfo(`IP-Address: ${IpAddress} is valid`);
                let status = await ping.promise.probe(IpAddress);
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

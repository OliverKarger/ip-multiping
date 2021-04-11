var { Select, prompt } = require("enquirer");
var validateIP = require("validate-ip-node");
var ping = require("ping");
var { exec } = require("child_process");
var { WriteInfo, WriteWarning, WriteSuccess, WriteRequest, WriteError, Header } = require("./ArtemisCLI");
var chalk = require("chalk");

/**
 * @author Oliver Karger
 * @description Contains Data returned from "GetIpAddresses()"
 */
type IpAddressListReturnType = {
    IpAddressList: string[];
};

/**
 * @author Oliver Karger
 * @description Contains Data return from cliPromptResult
 */
type IpAddressListPromiseReturnType = {
    IpAddressList: string;
};

/**
 * @author Oliver Karger
 * @description Get IP Addresses from User
 * @returns Object from Type: IpAddressListReturnType
 */
async function GetIpAddresses(): Promise<IpAddressListReturnType> {
    WriteRequest("Please select your preferred Way to input Data");
    // Response Variable
    var response: IpAddressListReturnType = { IpAddressList: [] };
    // Input Prompt
    var inputPrompt = new Select({
        name: "Action",
        message: "Your way:",
        choices: ["File", "Params/Args", "CLI"],
    });
    // Display inputPrompt
    await inputPrompt.run().then(async (answer) => {
        switch (answer) {
            case "File":
                break;
            case "Params/Args":
                var args: string[] = process.argv.slice(2);
                response.IpAddressList = args;
                break;
            case "CLI":
                // ! Returns single string, has to be splitted
                var cliPromptResult: IpAddressListPromiseReturnType = await prompt({
                    type: "input",
                    name: "IpAddressList",
                    message: "IP-Addresses",
                }).then((cliPrompt) => cliPrompt);
                // ! Split string for correct format
                response.IpAddressList = cliPromptResult.IpAddressList.split(",");
                break;
            default:
                WriteError("Invalid inputPrompt Result!");
                break;
        }
    });
    return response;
}

/**
 * @author Oliver Karger
 * @description Validate IPv4 Address
 * @param IpAddress IPv4 Address to be validated
 * @returns True if IPv4 Address is valid, false if not
 */
async function ValidateIPAddress(IpAddress: string): Promise<boolean> {
    if (validateIP(IpAddress)) {
        return true;
    } else {
        return false;
    }
}

// Display ArtemisCLI Header
Header();

/**
 * @author Oliver Karger
 * @description Main Method
 */
function main(): void {
    // Get IP Addresses from User
    GetIpAddresses().then(async (result) => {
        // Validate IP Addresses inputed by User and perform a single Ping
        result.IpAddressList.forEach(async (IpAddress) => {
            // Validate
            await ValidateIPAddress(IpAddress).then(async (isValid) => {
                if (isValid) {
                    // IP Address is valid
                    WriteInfo(`IP-Address: ${IpAddress} is valid`);
                    await ping.promise.probe(IpAddress).then(async (isAlive) => {
                        if (isAlive) {
                            WriteSuccess(`IP-Address: ${IpAddress} is alive!`);
                        } else {
                            WriteError(`IP-Address: ${IpAddress} is dead!`);
                        }
                    });
                } else {
                    // IP Address is invalid
                    WriteWarning(`IP-Address: ${IpAddress} is invalid!`);
                }
            });
        });
    });
}

// * Call Main Method - has to be on the bottom of the code
main();

// * Keep Console open
exec("pause");

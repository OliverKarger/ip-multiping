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
type IpAddressList = {
    AddressList: string[];
};

/**
 * @author Oliver Karger
 * @description Contains Data return from cliPromptResult
 */
type IpAddressListString = {
    AddressList: string;
};

/**
 * @author Oliver Karger
 * @description Get IP Addresses from User
 * @returns Object from Type: IpAddressListReturnType
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
    // Display inputPrompt
    var inputPromptResult = await inputPrompt.run();
    switch (inputPromptResult) {
        case "File":
            break;
        case "Params/Args":
            var args: string[] = process.argv.slice(2);
            response.AddressList = args;
            break;
        case "CLI":
            // ! Returns single string, has to be splitted
            var cliPromptResult: IpAddressListString = await prompt({
                type: "input",
                name: "AddressList",
                message: "IP-Addresses",
            }).then((cliPrompt) => cliPrompt);
            // ! Split string for correct format
            response.AddressList = cliPromptResult.AddressList.split(",");
            break;
        default:
            WriteError("Invalid inputPrompt Result!");
            break;
    }
    /*     await inputPrompt.run().then(async (answer) => {
        switch (answer) {
            case "File":
                break;
            case "Params/Args":
                var args: string[] = process.argv.slice(2);
                response.AddressList = args;
                break;
            case "CLI":
                // ! Returns single string, has to be splitted
                var cliPromptResult: IpAddressListString = await prompt({
                    type: "input",
                    name: "AddressList",
                    message: "IP-Addresses",
                }).then((cliPrompt) => cliPrompt);
                // ! Split string for correct format
                response.AddressList = cliPromptResult.AddressList.split(",");
                break;
            default:
                WriteError("Invalid inputPrompt Result!");
                break;
        }
    }); */
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
async function main(): Promise<void> {
    // Get IP Addresses from User
    let IPInput = await GetIpAddresses();
    IPInput.AddressList.forEach(async (IpAddress) => {
        // Validate
        let ipIsValid = await ValidateIPAddress(IpAddress);
        if (ipIsValid) {
            // IP Address is valid
            WriteInfo(`IP-Address: ${IpAddress} is valid`);
            await ping.promise
                .probe(IpAddress)
                .then(async (pingResult) => {
                    if (pingResult.alive) {
                        WriteSuccess(`IP-Address: ${IpAddress} is alive!`);
                    } else {
                        WriteWarning(`IP-Address: ${IpAddress} is dead!`);
                    }
                })
                .catch(() => {
                    WriteError(`IP-Address: ${IpAddress} is dead!`);
                });
        } else {
            // IP Address is invalid
            WriteWarning(`IP-Address: ${IpAddress} is invalid!`);
        }
    });
    /* GetIpAddresses().then(async (result) => {
        // Validate IP Addresses inputed by User and perform a single Ping
        result.AddressList.forEach(async (IpAddress) => {
            // Validate
            let ipIsValid = await ValidateIPAddress(IpAddress);
            if (ipIsValid) {
                // IP Address is valid
                WriteInfo(`IP-Address: ${IpAddress} is valid`);
                await ping.promise
                    .probe(IpAddress)
                    .then(async (pingResult) => {
                        if (pingResult.alive) {
                            WriteSuccess(`IP-Address: ${IpAddress} is alive!`);
                        } else {
                            WriteWarning(`IP-Address: ${IpAddress} is dead!`);
                        }
                    })
                    .catch(() => {
                        WriteError(`IP-Address: ${IpAddress} is dead!`);
                    });
            } else {
                // IP Address is invalid
                WriteWarning(`IP-Address: ${IpAddress} is invalid!`);
            }
        });
    }); */
}

// * Call Main Method - has to be on the bottom of the code
main();

// * Keep Console open
exec("pause");

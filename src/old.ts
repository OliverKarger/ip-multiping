const { Select, prompt } = require("enquirer");
const validateIP = require("validate-ip-node");
const ping = require("ping");
const { exec } = require("child_process");
import { WriteInfo, WriteWarning, WriteSuccess, WriteRequest, WriteError, Header } from "./ArtemisCLI";

type IpAdressListType = {
    IpAddressList: string[];
};

/**
 * @author Oliver Karger
 * @description Get IP Address from User using multible Prompts
 * @returns List of IP Addresses entered by the User
 */
async function GetIPAddresses(): Promise<IpAdressListType> {
    WriteRequest("Please select your preferred Way to input Data");
    // Response Variable
    var response: IpAdressListType = { IpAddressList: [] };
    // Get User Input
    const inputMethod = new Select({
        name: "Action",
        message: "Your Option:",
        choices: ["File", "Params/Args", "CLI"],
    });

    // Display User Prompt
    inputMethod.run().then(async (answer) => {
        if (answer === "File") {
            // Input from File
        } else if (answer === "Params/Args") {
            // Input using CLI Args
            var args: string[] = process.argv.slice(2);
            WriteInfo("ARGV: " + args);
            response.IpAddressList = args;
        } else if (answer === "CLI") {
            // Input inside CLI
            response.IpAddressList = await prompt({ type: "input", message: "IP-Addresses" });
        }
    });
    return response;
}

/**
 * @author Oliver Karger
 * @description Validate IPv4 Address
 * @param IpAddress to be validated
 * @returns True if IPv4 Address is valid, false if not
 */
async function ValidateIPAddress(IpAddress): Promise<boolean> {
    if (validateIP(IpAddress)) {
        return true;
    } else {
        return false;
    }
}

Header();

function main() {
    // Get IP Address to check from User
    GetIPAddresses()
        .then((result) => {
            // Validate all of those IP Address for correct Format / SN
            result.IpAddressList.forEach((IpAddress) => {
                ValidateIPAddress(IpAddress).then((IsValid) => {
                    if (IsValid) {
                        // IP Address is valid
                        WriteInfo(`IP-Address: ${IpAddress} valid!`);

                        // Ping IP Address
                        ping.promise.probe(IpAddress).then((IsReachable) => {
                            if (IsReachable) {
                                WriteSuccess(`IP-Address: ${IpAddress} is reachable!`);
                            } else {
                                WriteWarning(`IP-Address: ${IpAddress} is not reachable!`);
                            }
                        });
                    } else {
                        // IP Address is invalid
                        WriteWarning(`IP: ${IpAddress} invalid!`);
                    }
                });
            });
        })
        .catch((reason) => {
            WriteError("Some Unkown Error occured. Please contact the Developer! \n " + reason);
        });
}

// ! Call main Function, has to be on the bottom !
main();

exec("pause");

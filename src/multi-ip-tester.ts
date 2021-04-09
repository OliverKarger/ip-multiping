const { Select, prompt } = require("enquirer");
const validateIP = require("validate-ip-node");
const ping = require("ping");
const { exec } = require("child_process");
import { WriteInfo, WriteWarning, WriteSuccess, WriteRequest, WriteError, Header } from "./ArtemisCLI";

// * Get IP Addresses from User
async function GetIPAddresses(): Promise<any> {
    WriteRequest("Please select your preferred Way to input Data");
    var response = { IpAddressList: [] };
    const inputMethod = new Select({
        name: "Action",
        message: "Your Option:",
        choices: ["File", "Params/Args", "CLI"],
    });

    inputMethod.run().then(async (answer) => {
        if (answer === "File") {
        } else if (answer === "Params/Args") {
            var args: string[] = process.argv.slice(2);
            WriteInfo("ARGV: " + args);
            response.IpAddressList = args;
        } else if (answer === "CLI") {
            response = await prompt({ type: "input", name: "IpAddressList", message: "IP-Addresses" });
        }
    });

    // ! Old Way
    /*
    const response = await prompt({
        type: "input",
        name: "IpAddressList",
        message: "IP-Addresses",
    });*/
    return response;
}

async function ValidateIPAddress(IpAddress): Promise<boolean> {
    if (validateIP(IpAddress)) {
        return true;
    } else {
        return false;
    }
}

Header();

// Get IP Address to check from User
GetIPAddresses()
    .then((result) => {
        const IpAddressList = result.IpAddressList.split(",");
        console.log(IpAddressList);

        // Validate all of those IP Address for correct Format / SN
        IpAddressList.forEach((IpAddress) => {
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
    .catch(() => {
        WriteError("Some Unkown Error occured. Please contact the Developer!");
    });

exec("pause");

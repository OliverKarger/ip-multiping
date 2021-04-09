import { prompt } from "enquirer";
const validateIP = require("validate-ip-node");
const ping = require("ping");
import { WriteInfo, WriteWarning, WriteSuccess, WriteRequest, Header } from "./ArtemisCLI";

// * Get IP Addresses from User
async function GetIPAddresses() {
    const response = await prompt({
        type: "input",
        name: "IpAddressList",
        message: "IP-Addresses",
    });
    return response;
}

async function ValidateIPAddress(IpAddress: string): Promise<boolean> {
    if (validateIP(IpAddress)) {
        return true;
    } else {
        return false;
    }
}

Header();

WriteRequest("Please Enter the IP-Addresses that you want to check on:");

// Get IP Address to check from User
GetIPAddresses().then((result) => {
    const IpAddressList = result.IpAddressList.split(",");

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
});

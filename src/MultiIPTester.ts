import chalk from "chalk";
import boxen from "boxen";
import figures from "figures";
import readline from "readline";
import { WriteInfo, WriteError, WriteWarning, WriteSuccess, WriteRequest, Header, lineBreak } from "./ArtemisCLI";

// readline setup
const askFor = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function main() {
    // request ip from user
    WriteRequest("Please Enter IP-Addresses: \n -->");
}

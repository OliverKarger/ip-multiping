import chalk from "chalk";
import { circleQuestionMark } from "figures";
import boxen from "boxen";
import logSymbols from "log-symbols";

// REUSED CONSTS
const ArtemisCLI_AsciiLogo = `
  ___       _                 _     _____  _     _____
 / _ \\     | |               (_)   /  __ \\| |   |_   _|
/ /_\\ \\_ __| |_ ___ _ __ ___  _ ___| /  \\/| |     | |  
|  _  | '__| __/ _ \\ '_ \` _ \\| / __| |    | |     | |  
| | | | |  | ||  __/ | | | | | \\__ \\ \\__/\\| |_____| |_ 
\\_| |_/_|   \\__\\___|_| |_| |_|_|___/\\____/\\_____/\\___/ `;

const ArtemisCLI_AsciiLogo_Custom = `
  ___       _                 _     _____  _     _____
 / _ \\     | |               (_)   /  __ \\| |   |_   _|
/ /_\\ \\_ __| |_ ___ _ __ ___  _ ___| /  \\/| |     | |  
|  _  | '__| __/ _ \\ '_ \` _ \\| / __| |    | |     | |  
| | | | |  | ||  __/ | | | | | \\__ \\ \\__/\\| |_____| |_ 
\\_| |_/_|   \\__\\___|_| |_| |_|_|___/\\____/\\_____/\\___/ 

  Submodule: ArtemisCLI/ServerUtils/Servertester.ts`;

const defaultMsgTypeWidth: number = 23;
const defaultMsgTypePadChar: string = " ";
const lineBreak = "-------------------------------";

/**
 * @author Oliver Karger
 * @version 1.0
 * @description Prints 'ArtemisCLI' to Console using npm's boxes
 */
function Header() {
    console.log(
        boxen(ArtemisCLI_AsciiLogo_Custom, {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
        })
    );
}

/**
 * @author Oliver Karger
 * @version 1.0c
 * @description Displays Custom Error Message to Console
 * @param msg The Error Message to be displayed
 */
function WriteError(msg: string) {
    console.log(logSymbols.error, chalk.redBright("[ ERROR ]").padEnd(defaultMsgTypeWidth, defaultMsgTypePadChar), msg);
}

/**
 * @author Oliver Karger
 * @version 1.0c
 * @description Displays Custom Warning Message to Console
 * @param msg The Warning Message to be displayed
 */
function WriteWarning(msg: string) {
    console.log(
        logSymbols.warning,
        chalk.yellowBright("[ WARNING ]").padEnd(defaultMsgTypeWidth, defaultMsgTypePadChar),
        msg
    );
}

/**
 * @author Oliver Karger
 * @version 1.0b
 * @description Displays Custom Info Message to Console
 * @param msg The Informational Message to be displayed
 */
function WriteInfo(msg: string) {
    console.log(logSymbols.info, chalk.cyanBright("[ INFO ]").padEnd(defaultMsgTypeWidth, defaultMsgTypePadChar), msg);
}

/**
 * @author Oliver Karger
 * @version 1.0a
 * @description Displays Custom Success Message to Console
 * @param msg The Success Message to be displayed
 */
function WriteSuccess(msg: string) {
    console.log(
        logSymbols.success,
        chalk.greenBright("[ SUCCESS ]").padEnd(defaultMsgTypeWidth, defaultMsgTypePadChar),
        msg
    );
}

/**
 * @author Oliver Karger
 * @version 1.0a
 * @description Displays Custom Request Message to Console
 * @param msg The Request Message to be displayed
 */
function WriteRequest(msg: string) {
    console.log(
        circleQuestionMark,
        chalk.magentaBright("[ REQUEST ]").padEnd(defaultMsgTypeWidth, defaultMsgTypePadChar),
        msg
    );
}

// export
export { Header, WriteError, WriteWarning, WriteInfo, WriteSuccess, WriteRequest, lineBreak };

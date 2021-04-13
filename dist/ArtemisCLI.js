"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineBreak = exports.WriteRequest = exports.WriteSuccess = exports.WriteInfo = exports.WriteWarning = exports.WriteError = exports.Header = void 0;
var chalk_1 = __importDefault(require("chalk"));
var figures_1 = require("figures");
var boxen_1 = __importDefault(require("boxen"));
var log_symbols_1 = __importDefault(require("log-symbols"));
// REUSED CONSTS
var IPMultiPingAsciiLogo = "\n._____________     _____        .__   __  .__       .__                \n|   ______      /       __ __|  |_/  |_|__|_____ |__| ____    ____  \n|   ||     ___/  /   /  |  |    |   __  ____ |  |/      / ___ \n|   ||    |     /    Y      |  /  |_|  | |  |  |_> >  |   |  / /_/  >\n|___||____|     ____|__  /____/|____/__| |__|   __/|__|___|  /___  / \n                        /                   |__|           //_____/  ";
var lineBreak = "-------------------------------";
exports.lineBreak = lineBreak;
/**
 * @author Oliver Karger
 * @version 1.0
 * @description Prints 'ArtemisCLI' to Console using npm's boxes
 */
function Header() {
    console.log(boxen_1.default(IPMultiPingAsciiLogo, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green",
    }));
}
exports.Header = Header;
/**
 * @author Oliver Karger
 * @description Displays Custom Error Message to Console
 * @param msg The Error Message to be displayed
 */
function WriteError(msg) {
    console.log(log_symbols_1.default.error, chalk_1.default.redBright.bold("[ ERR! ]"), msg);
}
exports.WriteError = WriteError;
/**
 * @author Oliver Karger
 * @description Displays Custom Warning Message to Console
 * @param msg The Warning Message to be displayed
 */
function WriteWarning(msg) {
    console.log(log_symbols_1.default.warning, chalk_1.default.yellowBright.bold("[ WARN ]"), msg);
}
exports.WriteWarning = WriteWarning;
/**
 * @author Oliver Karger
 * @description Displays Custom Info Message to Console
 * @param msg The Informational Message to be displayed
 */
function WriteInfo(msg) {
    console.log(log_symbols_1.default.info, chalk_1.default.cyanBright.bold("[ INFO ]"), msg);
}
exports.WriteInfo = WriteInfo;
/**
 * @author Oliver Karger
 * @description Displays Custom Success Message to Console
 * @param msg The Success Message to be displayed
 */
function WriteSuccess(msg) {
    console.log(log_symbols_1.default.success, chalk_1.default.greenBright.bold("[ NICE ]"), msg);
}
exports.WriteSuccess = WriteSuccess;
/**
 * @author Oliver Karger
 * @description Displays Custom Request Message to Console
 * @param msg The Request Message to be displayed
 */
function WriteRequest(msg) {
    console.log(figures_1.circleQuestionMark, chalk_1.default.magentaBright.bold("[ IREQ ]"), msg);
}
exports.WriteRequest = WriteRequest;

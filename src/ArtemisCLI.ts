import chalk from 'chalk';
import { circleQuestionMark } from 'figures';
import boxen from 'boxen';
import logSymbols from 'log-symbols';

// REUSED CONSTS
export const IPMultiPingAsciiLogo = `
._____________     _____        .__   __  .__       .__                
|   \\______   \\   /     \\  __ __|  |_/  |_|__|_____ |__| ____    ____  
|   ||     ___/  /  \\ /  \\|  |  \\  |\\   __\\  \\____ \\|  |/    \\  / ___\\ 
|   ||    |     /    Y    \\  |  /  |_|  | |  |  |_> >  |   |  \\/ /_/  >
|___||____|     \\____|__  /____/|____/__| |__|   __/|__|___|  /\___  / 
                        \\/                   |__|           \\//_____/  `;

export const lineBreak = '-------------------------------';

/**
 * @author Oliver Karger
 * @version 1.0
 * @description Prints 'ArtemisCLI' to Console using npm's boxes
 */
export function header() {
    'use strict';
    console.log(
        boxen(IPMultiPingAsciiLogo, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
        })
    );
}

/**
 * @author Oliver Karger
 * @description Displays Custom Error Message to Console
 * @param msg The Error Message to be displayed
 */
export function writeError(msg: string) {
    'use strict';
    console.log(logSymbols.error, chalk.redBright.bold('[ ERR! ]'), msg);
}

/**
 * @author Oliver Karger
 * @description Displays Custom Warning Message to Console
 * @param msg The Warning Message to be displayed
 */
export function writeWarning(msg: string) {
    'use strict';
    console.log(logSymbols.warning, chalk.yellowBright.bold('[ WARN ]'), msg);
}

/**
 * @author Oliver Karger
 * @description Displays Custom Info Message to Console
 * @param msg The Informational Message to be displayed
 */
export function writeInfo(msg: string) {
    'use strict';
    console.log(logSymbols.info, chalk.cyanBright.bold('[ INFO ]'), msg);
}

/**
 * @author Oliver Karger
 * @description Displays Custom Success Message to Console
 * @param msg The Success Message to be displayed
 */
export function writeSuccess(msg: string) {
    'use strict';
    console.log(logSymbols.success, chalk.greenBright.bold('[ NICE ]'), msg);
}

/**
 * @author Oliver Karger
 * @description Displays Custom Request Message to Console
 * @param msg The Request Message to be displayed
 */
export function writeRequest(msg: string) {
    'use strict';
    console.log(circleQuestionMark, chalk.magentaBright.bold('[ IREQ ]'), msg);
}

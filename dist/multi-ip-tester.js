var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a = require("enquirer"), Select = _a.Select, prompt = _a.prompt;
var validateIP = require("validate-ip-node");
var ping = require("ping");
var exec = require("child_process").exec;
var _b = require("./ArtemisCLI"), WriteInfo = _b.WriteInfo, WriteWarning = _b.WriteWarning, WriteSuccess = _b.WriteSuccess, WriteRequest = _b.WriteRequest, WriteError = _b.WriteError, Header = _b.Header;
var chalk = require("chalk");
var fs = require("fs");
var marked = require("marked");
var MarkdownRenderer = require("marked-terminal");
var help = "\n--------\n- HELP -\n--------\n\n1. CLI\n -> Input IP-Addresses via Console\n\n2. Params/Args\n -> Input IP-Addresses via Args, comma seperated\n Example: ./<source-file> Address1,Address2,Address2\n\n3. File\n -> Load IP-Addresses from File\n Example: (hosts.json)\n    {\n        \"AddressList: [\n            \"10.0.0.1\",\n            \"192.168.1.1\",\n            \"172.16.0.1\",\n            \"8.8.8.8\",\n            \"8.8.4.4\",\n            \"1.1.1.1\"\n        ]\n    }\n";
// setup marked-terminal-renderer
marked.setOptions({
    // Custom renderer
    renderer: new MarkdownRenderer(),
});
/**
 * @author Oliver Karger
 * @description Get IP Addresses from User
 * @returns Object from Type: IpAddressList
 */
function GetIpAddresses() {
    return __awaiter(this, void 0, void 0, function () {
        var response, inputPrompt, InputPromptResult, filePath, cliPromptResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    WriteRequest("Please select your preferred Way to input Data");
                    response = { AddressList: [] };
                    inputPrompt = new Select({
                        name: "Action",
                        message: "Your way:",
                        choices: ["CLI", "Params/Args", "File", "Help"],
                    });
                    return [4 /*yield*/, inputPrompt.run()];
                case 1:
                    InputPromptResult = _a.sent();
                    if (!(InputPromptResult === "File")) return [3 /*break*/, 3];
                    WriteInfo("Current Location: " + process.cwd());
                    return [4 /*yield*/, prompt({
                            type: "input",
                            name: "path",
                            message: "Please Enter Path to Host File (.json)",
                        })];
                case 2:
                    filePath = _a.sent();
                    try {
                        response = JSON.parse(fs.readFileSync(filePath.path));
                    }
                    catch (e) {
                        WriteError(e);
                    }
                    return [3 /*break*/, 7];
                case 3:
                    if (!(InputPromptResult === "Params/Args")) return [3 /*break*/, 4];
                    // removes first 2 items (default nodejs args), formatts for correct format
                    response.AddressList = process.argv.slice(2)[0].split(",");
                    return [3 /*break*/, 7];
                case 4:
                    if (!(InputPromptResult === "CLI")) return [3 /*break*/, 6];
                    return [4 /*yield*/, prompt({
                            type: "input",
                            name: "AddressList",
                            message: "IP-Addresses",
                        })];
                case 5:
                    cliPromptResult = _a.sent();
                    // ! Split string for correct format
                    response.AddressList = cliPromptResult.AddressList.split(",");
                    return [3 /*break*/, 7];
                case 6:
                    if (InputPromptResult === "Help") {
                        WriteInfo("\n" + help);
                    }
                    else {
                        WriteError("Invalid Prompt Result!");
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/, response];
            }
        });
    });
}
// Display ArtemisCLI Header
Header();
/**
 * @author Oliver Karger
 * @description Main Method
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var IpAddressInput;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GetIpAddresses()];
                case 1:
                    IpAddressInput = _a.sent();
                    return [4 /*yield*/, Promise.all(IpAddressInput.AddressList.map(function (IpAddress) { return __awaiter(_this, void 0, void 0, function () {
                            var status;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, validateIP(IpAddress)];
                                    case 1:
                                        if (!_a.sent()) return [3 /*break*/, 3];
                                        // IP Address is valid
                                        WriteInfo("IP-Address: " + IpAddress + " is valid");
                                        return [4 /*yield*/, ping.promise.probe(IpAddress)];
                                    case 2:
                                        status = _a.sent();
                                        if (status.alive) {
                                            WriteSuccess("IP-Address: " + IpAddress + " is alive!");
                                        }
                                        else {
                                            WriteWarning("IP-Address: " + IpAddress + " is dead!");
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        // IP Address is invalid
                                        WriteWarning("IP-Address: " + IpAddress + " is invalid!");
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// * Call Main Method - has to be on the bottom of the code
main().catch(function (e) { return WriteError(e); });
// * Keep Console open
exec("pause");

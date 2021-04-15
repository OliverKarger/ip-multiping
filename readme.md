# IP-Multiping
[![CodeFactor](https://www.codefactor.io/repository/github/oliverkarger/ip-multiping/badge)](https://www.codefactor.io/repository/github/oliverkarger/ip-multiping)

Simple Tool to Ping multible IP-Addresses at once

## How it works
1. First, Download latest Release from GitHub
2. Extract Source Code
3. Install Dependencies: `npm install`
4. Start as Live Development Version: `npm start` to check if it starts
5. Build Executable: `npm run build`. This will create two Folders:
	- `@oliverkarger/` This Contains the Executables. Just copy and start
	- `pureJS`: This is used by `pkg` and `tsc` to store Typescript Files converted to pure Javascript
6. Use it!


## How to use it
1. Start it
2. You got three Options (+Help)
	- CLI: Enter IP Addresses using the CLI, seperated by commas: `10.0.0.1,10.0.0.2,10.0.0.2`
	- Params/Args: Use Args provided when starting the Executable: `./ip-multiping 10.0.0.1,10.0.0.2`
	- File: Input using a JSON Config File (Tutorial for that below)
3. First, IP Addresses will get validated for correct format and then pinged. See Results!


## How to create a Configuration File
Example:
```javascript
{
	"AddressList": ["10.0.0.1","10.0.0.2", "10.0.0.3"]
}
```

Those Files can contain up to ~2000 IP Addresses, depending on your OS and Hardware. 

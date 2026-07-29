// Used by the Windows release steps, which pass --config electron-builder.cjs. Everything else
// builds straight from package.json's "build" field, which this file re-exports — package.json
// wins whenever --config is not passed, because electron-builder only looks for a config file when
// no "build" key exists. This file exists only to switch Windows code signing on per build.
//
// Setting azureSignOptions swaps in WindowsSignAzureManager for the whole run, and that manager's
// computePublisherName() ignores appx.publisher and returns the Trusted Signing certificate subject
// instead — which would write the wrong Identity/Publisher into the Microsoft Store manifest. So
// the nsis/msiWrapped build runs with SIGN_WINDOWS=true and the appx build runs without it.
//
// Passing the options on the command line instead does not work: repeated "-c.win.x=y" arguments
// come back from yargs as a mix of objects and strings, and electron-builder turns each string into
// an "extends" path and then fails trying to open it as a file.
const { build } = require("./package.json");

const azureSignOptions = {
	endpoint: "https://neu.codesigning.azure.net/",
	codeSigningAccountName: "knockdata",
	certificateProfileName: "KnockData",
	publisherName: "CN=KnockData, O=KnockData, STREET=Kammakargatan 44, L=Stockholm, S=Stockholm, C=SE, PostalCode=11160",
};

module.exports = {
	...build,
	win: {
		...build.win,
		azureSignOptions: process.env.SIGN_WINDOWS === "true" ? azureSignOptions : null,
	},
};

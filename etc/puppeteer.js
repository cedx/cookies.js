import console from "node:console";
import {cp, writeFile} from "node:fs/promises";
import {createServer} from "node:http";
import {join} from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";
import handler from "serve-handler";

// Start the browser.
const browser = await puppeteer.launch();
const directory = join(import.meta.dirname, "../var");
const server = createServer((req, res) => handler(req, res, {public: directory}));

const page = await browser.newPage();
page.on("pageerror", error => console.error(error));
page.on("console", async message => {
	const args = await Promise.all(message.args().map(arg => arg.jsonValue()));
	if (args.length) console.log(args.shift(), ...args);
	else console.log(message.text());
});

await page.evaluate(() => console.log(navigator.userAgent));
await page.exposeFunction("exit", async code => {
	await browser.close();
	server.close();
	process.exit(code);
});

// Run the test suite.
await cp(join(import.meta.dirname, "../node_modules/mocha/mocha.js"), join(directory, "mocha.js"));
await writeFile(join(directory, "tests.html"), `
	<!DOCTYPE html>
	<html dir="ltr" lang="en">
		<head>
			<meta charset="utf-8">
		</head>

		<body>
			<script src="mocha.js"></script>
			<script>
				mocha.setup({reporter: "spec", ui: "bdd"});
			</script>

			<script src="tests.js"></script>
			<script>
				const runner = mocha.run();
				runner.on("end", () => exit(runner.failures));
			</script>
		</body>
	</html>
`);

server.listen(0, "127.0.0.1", () => {
	const {address, port} = server.address();
	page.goto(`http://${address}:${port}/tests.html`);
});

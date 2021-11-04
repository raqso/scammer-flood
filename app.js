import { config } from "dotenv";
import faker from "faker";
import FormData from "form-data";
import fetch from "node-fetch";
import async from "async";

config();

const DEFAULT_ITERATIONS = 10;
const DEFAULT_CONCURRENT_REQUESTS = 1;
const MAX_ERRORS = 10;

const [
	iterations = DEFAULT_ITERATIONS,
	concurrentRequests = DEFAULT_CONCURRENT_REQUESTS,
] = process.argv.splice(2);
const instances = Array(Number(iterations)).fill();

async function sendFakeForm() {
	const { formData, name } = getFakeForm();
	const logText = `Sent ${name} creds`;

	console.time(logText);
	const response = await fetch(process.env.ENDPOINT_URL, {
		method: "POST",
		body: formData,
	});
	console.log(response.status);
	console.timeEnd(logText);

	return response.statusText;
}

function getFakeForm() {
	const formData = new FormData();
	const name = `${faker.name.firstName()} ${faker.name.lastName()}`;

	formData.append("cardNumber", faker.finance.creditCardNumber());
	formData.append(
		"expdate",
		`${faker.datatype.number({
			min: 1,
			max: 12,
		})}/${faker.datatype.number({
			min: 2019,
			max: 2027,
		})}`
	);
	formData.append("cvv", faker.finance.creditCardCVV());
	formData.append("cardholder", name);
	formData.append("worker", "parabelumoscg");
	formData.append("card_balance", 1);
	formData.append(
		"pin",
		`${faker.finance.account()}`.split("").slice(0, 4).join("")
	);
	formData.append("item", "DPD_felgi657");

	return { formData, name };
}

const errors = [];
async.mapLimit(
	instances,
	Number(concurrentRequests),
	async function () {
		const result = await sendFakeForm();

		return result;
	},
	(error, results) => {
		if (error) {
			if (errors.length >= MAX_ERRORS) {
				throw error;
			}

			console.error(error);
			errors.push(error);
		}

		console.log("\n", `Sent ${results.length} fake forms`);
	}
);

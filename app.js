import { config } from "dotenv";
import faker from "faker";
import FormData from "form-data";
import fetch from "node-fetch";
import async from "async";

config();

const INSTANCES_COUNT = 1000;
const CONCURRENT_REQUESTS = 50;
const instances = Array(INSTANCES_COUNT).fill();

async function sendFakeForm() {
	const body = getFakeForm();

	const response = await fetch(process.env.ENDPOINT_URL, {
		method: "POST",
		body,
	});

	return response.statusText;
}

function getFakeForm() {
  const { email, password } = getUser();
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  return formData;
}

function getUser() {
	return {
		email: faker.internet.email(),
		password: faker.internet.password(),
	};
}

async.mapLimit(
	instances,
	CONCURRENT_REQUESTS,
	async function () {
		const result = await sendFakeForm();
    console.log(result);
    return result;
	},
	(err, results) => {
		if (err) throw err;
	}
);

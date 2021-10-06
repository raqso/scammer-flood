import { config } from "dotenv";
import faker from "faker";
import FormData from "form-data";
import fetch from "node-fetch";
import async from "async";

config();

const INSTANCES_COUNT = 10;
const CONCURRENT_REQUESTS = 3;
const instances = Array(INSTANCES_COUNT).fill();

async function sendFakeForm() {
	const { formData, user } = getFakeForm();
  const logText = `Sent ${user.email}, ${user.password}`;;

  console.time(logText);
	const response = await fetch(process.env.ENDPOINT_URL, {
		method: "POST",
		body: formData,
	});
  console.timeEnd(logText);

	return response.statusText;
}

function getFakeForm() {
  const user = getUser();
  const { email, password } = user;
  const formData = new FormData();

  formData.append("email", email);
  formData.append("password", password);

  return {formData, user};
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

    return result;
	},
	(err, results) => {
		if (err) throw err;
	}
);

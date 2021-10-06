import { config } from "dotenv";
import faker from "faker";
import FormData from "form-data";
import fetch from "node-fetch";
import async from "async";

config();

const DEFAULT_ITERATIONS = 10;
const DEFAULT_CONCURRENT_REQUESTS = 1;

const [iterations = DEFAULT_ITERATIONS, concurrentRequests = DEFAULT_CONCURRENT_REQUESTS] =
	process.argv.splice(2);
const instances = Array(Number(iterations)).fill();

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
	Number(concurrentRequests),
	async function () {
		const result = await sendFakeForm();

    return result;
	},
	(err, results) => {
		if (err) throw err;

    console.log(`Sent ${results.length} fake forms`)
	}
);

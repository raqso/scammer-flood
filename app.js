var faker = require("faker");

function getUser() {
	return {
		email: faker.internet.email(),
		password: faker.internet.password(),
	};
}

require('ts-node/register');

exports.config = {
	tests: './**/*_test.ts',
	output: './output',
	helpers: {
		REST: {
			endpoint: 'https://alecsandro-imersao-javascript.herokuapp.com',
			onRequest: () => {
				//request.headers.auth = "123";
			}
		},
	},
	include: {
		I: './steps_file.ts'
	},
	bootstrap: null,
	mocha: {},
	name: 'codeceptjs-rest-demo',
	plugins: {
		allure: {
			outputDir: 'output',
			enabled: true
		}
	}
};

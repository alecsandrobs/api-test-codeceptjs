export { };
import { errorResponseSchema, errorNotFoundResponseSchema } from '../schema/error';
import { pessoaResponseSchema, pessoasResponseSchema } from '../schema/pessoa';
const { I } = inject();
const Joi = require('joi');
const statusCodes = require('http-status-codes').StatusCodes
var _person: any = null


Feature('People');

BeforeSuite(async () => {
	const people = await I.sendGetRequest('/pessoas');
	for (const person of people.data) {
		I.say('Given that I have no people registered')
		let response = await I.sendDeleteRequest(`/pessoas/${person._id}`)
		await I.assertEqual(response.status, statusCodes.NO_CONTENT);
	}
});

Scenario('Verify creating a valid person', async () => {
	const person = {
		nome: 'Pessoa Criada pelo CodeceptJS',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	I.say('when I attempt to create a person')
	const response = await I.sendPostRequest('/pessoas', person);
	I.say('then I see the CREATED response status')
	await I.assertEqual(response.status, statusCodes.CREATED);
	I.say('and I see that the response body is pessoa schema')
	await Joi.attempt(response.data, pessoaResponseSchema)
});

Scenario('Verify creating a invalid person', async () => {
	const person = {
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	I.say('when I attempt to create a person withou name')
	const response = await I.sendPostRequest('/pessoas', person);
	I.say('then I see the BAD REQUEST response status')
	await I.assertEqual(response.status, statusCodes.BAD_REQUEST);
	I.say('and I see that the response body is error schema')
	await Joi.attempt(response.data, errorResponseSchema)
});

Scenario('Verify getting all people', async () => {
	I.say('when I attempt to get all people')
	const response = await I.sendGetRequest('/pessoas');
	I.say('then I see the OK response status')
	await I.assertEqual(response.status, statusCodes.OK);
	I.say('and I see that the response body is pessoas schema')
	await Joi.attempt(response.data, pessoasResponseSchema)
	_person = await response.data[0]
});

Scenario('Verify getting only one person by valid id', async () => {
	I.say('when I attempt to get an specific person')
	const response = await I.sendGetRequest(`/pessoas/${_person._id}`);
	I.say('then I see the OK response status')
	await I.assertEqual(response.status, statusCodes.OK);
	I.say('and I see that the response body is pessoa schema')
	await Joi.attempt(response.data, pessoaResponseSchema)
});

Scenario('Verify getting only one person by invalid id', async () => {
	I.say('when I attempt to get an specific person')
	const response = await I.sendGetRequest('/pessoas/987654321');
	I.say('then I see the NOT FOUND response status')
	await I.assertEqual(response.status, statusCodes.NOT_FOUND);
	I.say('and I see that the response body is not found error schema')
	await Joi.attempt(response.data, errorNotFoundResponseSchema)
});

Scenario('Verify updating a valid person', async () => {
	const person = {
		nome: 'Pessoa Atualizada pelo CodeceptJS',
		telefone: '+55 (48) 12345-6789',
		email: 'pessoa.codecept@email.com',
	}
	I.say('when I attempt to update a person')
	const response = await I.sendPutRequest(`/pessoas/${_person._id}`, person);
	I.say('then I see the OK response status')
	await I.assertEqual(response.status, statusCodes.OK);
	I.say('and I see that the response body is pessoa schema')
	await Joi.attempt(response.data, pessoaResponseSchema)
});

Scenario('Verify updating a invalid person', async () => {
	const person = {
		nome: '',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	I.say('when I attempt to update a person without name')
	I.say('when I send a PUT request to /pessoas by its id and without "nome"')
	const response = await I.sendPutRequest(`/pessoas/${_person._id}`, person);
	I.say('then I see the BAD REQUEST response status')
	await I.assertEqual(response.status, statusCodes.BAD_REQUEST);
	I.say('and I see that the response body is error schema')
	await Joi.attempt(response.data, errorResponseSchema)
});

Scenario('Verify updating noexistent person', async () => {
	const person = {
		nome: 'Pessoa Atualizada pelo CodeceptJS (ERRO)',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	I.say('when I attempt to update a noexistent person')
	const response = await I.sendPutRequest('/pessoas/777', person);
	I.say('then I see the NOT FOUND response status')
	await I.assertEqual(response.status, statusCodes.NOT_FOUND);
	I.say('and I see that the response body is not found error schema')
	await Joi.attempt(response.data, errorNotFoundResponseSchema)
});

Scenario('Verify deleting a valid person', async () => {
	I.say('when I attempt to delete a person')
	const response = await I.sendDeleteRequest(`/pessoas/${_person._id}`);
	I.say('then I see the NO CONTENT response status')
	await I.assertEqual(response.status, statusCodes.NO_CONTENT);
	I.say('and I see that the response body is empty')
	await I.assertEqual(response.data, '')
});

Scenario('Verify deleting noexistent person', async () => {
	const person = {
		nome: 'Pessoa Atualizada pelo CodeceptJS (ERRO)',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	I.say('when I attempt to delete a noexistent person')
	const response = await I.sendDeleteRequest('/pessoas/777');
	I.say('then I see the NOT FOUND response status')
	await I.assertEqual(response.status, statusCodes.NOT_FOUND);
	I.say('and I see that the response body is not found error schema')
	await Joi.attempt(response.data, errorNotFoundResponseSchema)
});
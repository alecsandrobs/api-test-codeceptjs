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
	for(const person of people.data)	{
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
	const response = await I.sendPostRequest('/pessoas', person);
	await I.assertEqual(response.status, statusCodes.CREATED);
	await Joi.attempt(response.data, pessoaResponseSchema)
});

Scenario('Verify creating a invalid person', async () => {
	const person = {
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	const response = await I.sendPostRequest('/pessoas', person);
	await I.assertEqual(response.status, statusCodes.BAD_REQUEST);
	await Joi.attempt(response.data, errorResponseSchema)
});

Scenario('Verify getting all people', async () => {
	const response = await I.sendGetRequest('/pessoas');
	await I.assertEqual(response.status, statusCodes.OK);
	await Joi.attempt(response.data, pessoasResponseSchema)
	_person = await response.data[0]
});

Scenario('Verify getting only one person by valid id', async () => {
	const response = await I.sendGetRequest(`/pessoas/${_person._id}`);
	await I.assertEqual(response.status, statusCodes.OK);
	await Joi.attempt(response.data, pessoaResponseSchema)
});

Scenario('Verify getting only one person by invalid id', async () => {
	const response = await I.sendGetRequest('/pessoas/987654321');
	await I.assertEqual(response.status, statusCodes.NOT_FOUND);
	await Joi.attempt(response.data, errorNotFoundResponseSchema)
});

Scenario('Verify updating a valid person', async () => {
	const person = {
		nome: 'Pessoa Atualizada pelo CodeceptJS',
		telefone: '+55 (48) 12345-6789',
		email: 'pessoa.codecept@email.com',
	}
	const response = await I.sendPutRequest(`/pessoas/${_person._id}`, person);
	await I.assertEqual(response.status, statusCodes.OK);
	await Joi.attempt(response.data, pessoaResponseSchema)
});

Scenario('Verify updating a invalid person', async () => {
	const person = {
		nome: '',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	const response = await I.sendPutRequest(`/pessoas/${_person._id}`, person);
	await I.assertEqual(response.status, statusCodes.BAD_REQUEST);
	await Joi.attempt(response.data, errorResponseSchema)
});

Scenario('Verify updating noexistent person', async () => {
	const person = {
		nome: 'Pessoa Atualizada pelo CodeceptJS (ERRO)',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	const response = await I.sendPutRequest('/pessoas/777', person);
	await I.assertEqual(response.status, statusCodes.NOT_FOUND);
	await Joi.attempt(response.data, errorNotFoundResponseSchema)
});

Scenario('Verify deleting a valid person', async () => {
	const response = await I.sendDeleteRequest(`/pessoas/${_person._id}`);
	await I.assertEqual(response.status, statusCodes.NO_CONTENT);
	await I.assertEqual(response.data, '')
});

Scenario('Verify deleting noexistent person', async () => {
	const person = {
		nome: 'Pessoa Atualizada pelo CodeceptJS (ERRO)',
		telefone: '+55 (48) 98765-4321',
		email: 'pessoa.codecept@email.com',
	}
	const response = await I.sendDeleteRequest('/pessoas/777');
	await I.assertEqual(response.status, statusCodes.NOT_FOUND);
	await Joi.attempt(response.data, errorNotFoundResponseSchema)
});
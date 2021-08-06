const Joi = require('joi');
const { object, string, date, number, array } = Joi.types()

export const pessoaResponseSchema = object.keys({
    _id: string.required(),
    nome: string.required(),
    telefone: string.allow(null),
    email: string.allow(null),
    createdAt: date.required(),
    updatedAt: date.allow(null).required(),
    __v: number.required()
})

export const pessoasResponseSchema = array.items(
    pessoaResponseSchema
)
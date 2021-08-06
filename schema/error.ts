const Joi = require('joi')
const { object, string, boolean, number } = Joi.types()

export const errorResponseSchema = object.keys({
    errors: object.keys({
        nome: object.keys({
            message: string.required(),
            name: string.required(),
            properties: object.keys({
                message: string.required(),
                type: string.required(),
                value: string.allow(''),
                path: string.required()
            }).required(),
            kind: string.required(),
            path: string.required(),
            value: string.allow(''),
            $isValidatorError: boolean.required()
        }).required()
    }).required(),
    _message: string.required(),
    message: string.required(),
    name: string.required()
}).required()

export const errorNotFoundResponseSchema = object.keys({
    message: string.required(),
    name: string.required(),
    stringValue: string.required(),
    kind: string.required(),
    value: string.required(),
    path: string.required()
})
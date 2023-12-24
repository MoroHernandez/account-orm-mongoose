import { Type } from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import Ajv from "ajv"


const LoginDTOSchema =  Type.Object (
    {
        email: Type.String({
            format: 'email',
            errorMessage: {
                type: 'Email must be a string type',
                format: 'Email must contain a valid email format'
            }
        }),
        password: Type.String({
            errorMessage:{
                type: 'Password must be a string type'
            }
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: 'El formato del objeto no es valido'
        }
    }
    )
    
const ajv = new Ajv({allErrors: true})
addFormats(ajv, ['email']).addKeyword('kind').addKeyword('modifier')
addErrors(ajv)
const validate = ajv.compile(LoginDTOSchema)

const validateLoginDTO = (req, res, next) => {
    const isDTOValid = validate(req.body)

    if (!isDTOValid) res.status(400).send(ajv.errorsText(validate.errors, {separator: '\n'}))

   next()
}


export default validateLoginDTO
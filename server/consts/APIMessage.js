export const serverError = (error) => {
    return {
        code: 500,
        catchError: error ? error?.message : "",
        message: 'Internal server error'
    }
}

export const fieldValidationError = (fields, params) => {
    let errorFields = [];
    fields.forEach((field) => {
        if(!params.hasOwnProperty(field)) {
            errorFields.push(field);
        }
    });

    if(errorFields.length > 0) {
        return {
            message: 'Field validation error',
            fields: errorFields,
            code: 403
        }
    } else {
        null;
    }
}
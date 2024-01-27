export const serverError = (error) => {
    return {
        code: 500,
        catchError: error ? error?.message : "",
        error: error ? JSON.stringify(error) : "",
        message: 'Internal server error'
    }
}

export const fieldValidationError = (fields, params) => {
    let errorFields = [];
    fields.forEach((field) => {
        if(!Object.keys(params).includes(field)) {
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
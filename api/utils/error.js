export const errorHandler = (statusCode,message)=>{
    const error = new Error()   // js error handling object
    error.statusCode = statusCode
    error.message=message;
    return error;
};
// import  {validate} from "joi";

const isValid = (Schema) => {
  return (req, res, next) => {
    const requests = { ...req.body, ...req.params, ...req.query };
    const validationResult = Schema.validate(requests, { abortEarly: false });
    if (validationResult.error) {
      const messages = validationResult.error.details.map(
        (error) => error.message
      );
      return next(new Error(messages, { cause: 500 }));
    }
    next();
  };
};
export default isValid;

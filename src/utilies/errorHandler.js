const asyncHandler = (controller) => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch((error) => next(error));
  };
};

export default asyncHandler;

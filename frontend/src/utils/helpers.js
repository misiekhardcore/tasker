export const errorHandler = (errors, setErrors) => {
  const err = errors.graphQLErrors[0]?.extensions?.errors;
  errors ? setErrors(err) : console.error({ ...errors });
};

// password validation - for login and register
export const validatePassword = () => {
  return (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error("Password length has to be longer than 6 digits"));
    } else {
      callback();
    }
  };
};
// verification code validation
export const validateCode = () => {
  return (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error("Code length has to be 6 digits"));
    } else {
      callback();
    }
  };
};

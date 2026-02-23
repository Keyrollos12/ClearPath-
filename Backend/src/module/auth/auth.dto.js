
export const registerDto = {
  fullName: "string",
  email: "string",
  password: "string",
  phoneNumber: "string",
  gender: "male|female"
};

export const loginDto = {
  email: "string",
  password: "string"
};

export const verifyDto = {
  email: "string",
  otp: "string"
};


export const googleLoginDto = {
  idToken: "string"
};
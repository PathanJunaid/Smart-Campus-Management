import { API } from "./api";

export const LoginUser = async (email, password) => {
  try {
    const res = await API.post("/api/users/auth/login", {
      email,
      password,
    });

    return res.data;  

  } catch (error) {
    console.error("Login API Error:", error);

    return {
      success: false,
      message: "Network error",
    };
  }
};


export const signupStep1 = async (email) => {
  const res = await API.post("/api/users/signup/step1", {
    email
  });
  return res.data;
};


export const signupStep2 =  async (email, password, otp) => {
    const res = await API.post("/api/users/signup/step2", {
        email,
        password, 
        otp
    })

    return res.data;
}


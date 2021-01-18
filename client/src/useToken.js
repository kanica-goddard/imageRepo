import { useState } from "react";

const useToken = () => {
  /**
   * Get token from session storage
   */
  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    // using ? as userToken could be undefined
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  /**
   * Add token to session storage
   * @param {*} userToken
   */
  const saveToken = (userToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
};

export default useToken;

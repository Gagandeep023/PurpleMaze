import React, { useEffect } from "react";
import "../screens/Home/style.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { BASE_AUTH_URL } from "../api/config";

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParamsObj = {};

  for (const [key, value] of searchParams.entries()) {
    queryParamsObj[key] = value;
  }

  const objectToQueryString = (obj) => {
    const params = new URLSearchParams();
    for (const key in obj) {
      params.append(key, obj[key]);
    }
    return params.toString();
  };

  const queryString = objectToQueryString(queryParamsObj);

  const baseUrl = BASE_AUTH_URL + "/api/v1/google/auth/callback";

  const finalUrl = baseUrl + "?" + queryString;

  const onLanding = async () => {
    try {
      const response = await axios.get(finalUrl);
      if (response?.status === 200) {
        const accessToken = response.data.accessToken;
        const roles = response.data.roles;
        const expiresIn = response.data.expiresIn;
        const expires = moment().add(expiresIn);

        // Store data in local storage
        localStorage.setItem(
          "accessAuth",
          JSON.stringify({ accessToken, roles, expires })
        );

        navigate("/SearchPage", { replace: true });
      } else {
        navigate("/something-went-wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onLanding();
  }, []);

  return <div className="outer-container"></div>;
};
export default LoginWithGoogle;

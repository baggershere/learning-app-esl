import Cookies from "universal-cookie";

const setCookie = (accessToken) => {
  const cookie = new Cookies();
  cookie.set("authorization", "Bearer " + accessToken, {
    secure: false,
    httpOnly: false,
  });
  console.log(accessToken)
};

export default setCookie

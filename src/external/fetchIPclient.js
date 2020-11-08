import axios from "axios";
import axios0 from "../apis/axios";
const infoClient = localStorage.getItem("info-client");

// const key = "02924c9a5a777f4d4854a45a326432c6";

const GeoAPI = "https://ipapi.co/ip";

const fetchIPclient = async () => {
  const res = await axios.get(GeoAPI, { mode: "no-cors" });
  //   set the current country code in local stoarge
  localStorage.setItem("info-client", `nds9h:u75GL::ris` + res.data + `nY5Tu:2ufGL::ris`);
  const post = {
    ip: res.data,
    timestamp: new Date(),
    }
  await axios0
    .post('/ndsapi/client', post)
    .then(function(response) {
      // console.log(response.data.status);
      console.log("Successfull");
      // also clear the form
    })
    .catch(function(error) {
      console.log("Error is fetching!");
      if (error.response) {
        if (error.response.status === 429) {
          console.log("Error is sending to server!");
        }
      }
    });
};

if (!infoClient) {
  // if country is not set then only set it
  fetchIPclient();
}

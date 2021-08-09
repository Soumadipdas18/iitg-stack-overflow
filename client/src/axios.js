import axios from "axios";

const instance = axios.create({
  baseURL: "https://apistackoverflowiitg.herokuapp.com/",
});

export default instance;

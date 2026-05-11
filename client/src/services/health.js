import axios from "axios";
const baseUrl = "/api/health";

const getHealth = async() => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default { getHealth };
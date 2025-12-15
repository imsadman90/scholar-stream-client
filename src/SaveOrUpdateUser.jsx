import axios from "axios";

const SaveOrUpdateUser = async (user) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/users`,
    user,
    { withCredentials: true }
  );
  return data;
};

export default SaveOrUpdateUser;

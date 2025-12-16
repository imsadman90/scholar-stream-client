import axios from "axios";

const SaveOrUpdateUser = async (user) => {
  const { data } = await axios.post(
    `/users`,
    user,
    { withCredentials: true }
  );
  return data;
};

export default SaveOrUpdateUser;

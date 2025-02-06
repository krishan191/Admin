import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
// const USER_URL = "/users";
// const GET_USERS_URL = "/users/query";

const USER_URL = "api/users";
const GET_USERS_URL = "api/users/query";
const CREATE_USERS_URL = "api/users/create";
// console.log(USER_URL);

const getUsers = async (query: string): Promise<UsersQueryResponse> => {
  try {
    // Validate the query parameter
    if (!query || typeof query !== "string") {
      throw new Error("Invalid query parameter");
    }

    // Make the API request
    const response: AxiosResponse<UsersQueryResponse> = await axios.get(
      `${GET_USERS_URL}?${query}`
    );

    // Validate the response data
    if (!response.data) {
      throw new Error("Invalid API response: data is undefined");
    }

    // Return the validated data
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return a default response or re-throw the error
    throw new Error("Failed to fetch users"); // Re-throw the error for the caller to handle
  }
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const createUser = async (user: User): Promise<User> => {
  // console.log("createuser", user);

  try {
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(user).forEach((key) => {
      const value = user[key as keyof User];
      if (value !== undefined && value !== null) {
        formData.append(key, value as Blob | string);
      }
    });

    // console.log(formData);

    // Send the request with `multipart/form-data`
    const response: AxiosResponse<User> = await axios.post(
      `${CREATE_USERS_URL}`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    // console.log("User created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating user frontend:", error);
    throw error;
  }
};

const updateUser = async (user: User): Promise<User> => {
  try {
    if (!user._id) {
      throw new Error("User ID is required for update");
    }

    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(user).forEach((key) => {
      const value = user[key as keyof User];
      if (value !== undefined && value !== null) {
        formData.append(key, value as Blob | string);
      }
    });

    // Send the request with `multipart/form-data`
    const response: AxiosResponse<User> = await axios.put(
      `${USER_URL}/update/${user._id}`, // Ensure API accepts user ID in URL
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log("User updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/delete/${userId}`).then(() => {
    alert("user deleted successfully");
  });
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) =>
    axios.delete(`${USER_URL}/delete/${id}`)
  );
  return axios.all(requests).then(() => {});
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};

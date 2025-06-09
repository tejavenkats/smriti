import Axios from "axios";

const axios = Axios.create({});

export const getRequest = async (url: string, headers?: any) => {
  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    return res;
  } catch (error) {
    console.error(`Error while making GET request: ${url}`, error);
  }
};

export const postRequest = async (url: string, body: any, headers?: any) => {
  try {
    const res = await axios.post(url, body, {
      headers: headers,
    });
    return res;
  } catch (error) {
    console.error(`Error while making POST request: ${url}`, error);
  }
};

export const putRequest = async (url: string, body: any, headers?: any) => {
  console.log("headers: ", headers);

  try {
    const res = await axios.put(url, body, {
      headers: headers,
    });
    return res;
  } catch (error) {
    console.error(`Error while making PUT request: ${url}`, error);
  }
};

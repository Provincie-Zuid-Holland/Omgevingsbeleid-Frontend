import axios from 'axios';

const access_token = localStorage.getItem('access_token');
const api_version = 'v0.1';
const instance = axios.create({
  baseURL: `https://api-acctest-ob.westeurope.cloudapp.azure.com/dev/${api_version}`,
  headers: {
  	'Content-Type': 'application/json',
  	'Authorization': `Token ${access_token}`
  }
});

export default instance;
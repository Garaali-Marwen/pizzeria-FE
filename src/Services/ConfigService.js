import axios from 'axios'
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/config'
class ConfigService {

    getConfig(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    editConfigImages(formData) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update/image`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    editConfig(config) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, config, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
}

const configServiceInstance = new ConfigService();
export default configServiceInstance;
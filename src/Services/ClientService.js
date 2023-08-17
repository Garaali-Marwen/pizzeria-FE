import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/client'
class ClientService{

    getAllClients(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`)
    }

    addClient(client){
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, client)
    }

    getClientById(id){
        return axios.get(`${PIZZERIA_API_BASE_URL}/${id}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }
}

const clientServiceInstance = new ClientService();
export default clientServiceInstance;
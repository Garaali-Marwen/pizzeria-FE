import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/client'
class ClientService{
    getAllClients(pageNumber, pageSize){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/${pageNumber}/${pageSize}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    getClientsNumber(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    getNewClients(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/new`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }


    addClient(client){
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, client)
    }

    passwordVerification(password, clientId){
        return axios.post(`${PIZZERIA_API_BASE_URL}/password/verification/${clientId}`, password, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateClientImage(formData){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update/image`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateClientPassword(password, clientId){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update/password/${clientId}`, password, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }

    updateClient(formData){
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }


    getClientById(id){
        return axios.get(`${PIZZERIA_API_BASE_URL}/${id}`, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} })
    }
}

const clientServiceInstance = new ClientService();
export default clientServiceInstance;
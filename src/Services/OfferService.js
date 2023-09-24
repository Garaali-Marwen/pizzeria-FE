import axios from 'axios'
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/offer'
class OfferService {

    getAllOffers(pageNumber, pageSize){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/${pageNumber}/${pageSize}`)
    }

    getAllAvailableOffers(){
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`)
    }

    addOffer(formData) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/add`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }

    editOffer(formData) {
        return axios.put(`${PIZZERIA_API_BASE_URL}/update`, formData, { headers: {"Authorization" : `Bearer ${UserService.getToken()}`} });
    }
}

const offerServiceInstance = new OfferService();
export default offerServiceInstance;
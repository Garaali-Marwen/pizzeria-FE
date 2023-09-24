import axios from "axios";
import UserService from "./UserService";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/transaction'

class TransactionService {

    getAllTransactions(pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/all/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getTransactionsByClientId(clientId, pageNumber, pageSize) {
        return axios.get(`${PIZZERIA_API_BASE_URL}/client/${clientId}/${pageNumber}/${pageSize}`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getIncomeForActualDay() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/day/income`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getIncomeForActualWeek() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/week/income`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getIncomeForActualMonth() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/month/income`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getTransactionsForActualDay() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/day`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getTransactionsForActualWeek() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/week`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

    getTransactionsForActualMonth() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/month`, {headers: {"Authorization": `Bearer ${UserService.getToken()}`}});
    }

}

const transactionServiceInstance = new TransactionService();
export default transactionServiceInstance;
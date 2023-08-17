import axios from "axios";

const PIZZERIA_API_BASE_URL = 'http://localhost:8080/api/user'

class UserService {

    getAllUsers() {
        return axios.get(`${PIZZERIA_API_BASE_URL}/all`)
    }

    userLogin(user) {
        return axios.post(`${PIZZERIA_API_BASE_URL}/authenticate`, user)
    }

    getUserById(id){
        return axios.get(`${PIZZERIA_API_BASE_URL}/${id}`,
            {headers: {"Authorization" : `Bearer ${this.getToken()}`}})
    }


    getUserId() {
        return JSON.parse(localStorage.getItem('userId'))
    }

    setUserId(userId) {
        localStorage.setItem('userId', JSON.stringify(userId))
    }

    getUserEmail() {
        return JSON.parse(localStorage.getItem('userEmail'))
    }

    setUserEmail(userEmail) {
        localStorage.setItem('userEmail', JSON.stringify(userEmail))
    }

    setRoles(role) {
        localStorage.setItem('role', JSON.stringify(role))
    }

    getRole() {
        return JSON.parse(localStorage.getItem('role'))
    }

    setToken(token) {
        localStorage.setItem('token', JSON.stringify(token))
    }

    getToken() {
        return JSON.parse(localStorage.getItem('token'))
    }

    setCart(item) {
        const cart = this.getCart();
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    deleteItemFromCart(itemId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    updateItemCart(itemUpdated) {
        let cart = this.getCart();
        const index = cart.findIndex(item => item.id === itemUpdated.id);
        if (index !== -1) {
            cart[index] = itemUpdated;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    updateExistingItemCart(orderItemUpdated) {
        let cart = this.getCart();
        const index = cart.findIndex(orderItem => orderItem.item.id === orderItemUpdated.item.id);
        if (index !== -1) {
            cart[index] = orderItemUpdated;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }


    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || []
    }

    clear() {
        localStorage.clear()
    }

    isLoggedIn() {
        if (this.getRole())
            return true
        return false
    }

}

const UserServiceInstance = new UserService();
export default UserServiceInstance;
import axios from "axios";

export default class ApiService {

    // URL BASE PARA LA API
    static BASE_URL = "http://localhost:8080";

    // GENERA LOS ENCABEZADOS CON EL TOKEN DE AUTORIZACIÓN
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    // ----------------------------------
    // API DE AUTH Y USERS
    // ----------------------------------

    /** REGISTRA UN NUEVO USUARIO */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
        return response.data;
    }

    /** INICIA SESIÓN PARA UN USUARIO */
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
        return response.data;
    }

    /** OBTIENE LA INFORMACIÓN DEL USUARIO LOGUEADO */
    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    // ----------------------------------
    // ENDPOINTS PARA PRODUCTS
    // ----------------------------------

    /** AGREGA UN NUEVO PRODUCTO CON FORM DATA */
    static async addProduct(formData) {
        const response = await axios.post(`${this.BASE_URL}/product/create`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    /** ACTUALIZA UN PRODUCTO EXISTENTE POR ID */
    static async updateProduct(productId, formData) {
        const response = await axios.put(`${this.BASE_URL}/product/update/${productId}`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    /** OBTIENE TODOS LOS PRODUCTOS */
    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/product/get-all`);
        return response.data;
    }

    /** BUSCA PRODUCTOS POR UN VALOR DE BÚSQUEDA */
    static async searchProducts(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/product/search`, {
            params: { searchValue }
        });
        return response.data;
    }

    /** OBTIENE TODOS LOS PRODUCTOS POR ID DE CATEGORÍA */
    static async getAllProductByCategoryId(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-category-id/${categoryId}`);
        return response.data;
    }

    /** OBTIENE UN PRODUCTO ESPECÍFICO POR ID */
    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-product-id/${productId}`);
        return response.data;
    }

    /** ELIMINA UN PRODUCTO POR ID */
    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/product/delete/${productId}`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    // ----------------------------------
    // ENDPOINTS PARA CATEGORY
    // ----------------------------------

    /** CREAR UNA CATEGORY */
    static async createCategory(body){
        const response=await axios.post(`${this.BASE_URL}/category/create`,body,{
            headers:this.getHeader()
        });
        return response.data;
    }

    /** OBTENER TODAS LAS CATEGORY */
    static async getAllCategory(){
        const response=await axios.get(`${this.BASE_URL}/category/get-all`);
        return response.data;
    }

    /** OBTENER LA CATEGORY POR EL ID */
    static async getCategoryById(categoryId){
        const response=await axios.get(`${this.BASE_URL}/category/get-category-by-id/${categoryId}`);
        return response.data;
    }

    /** EDITAR LA CATEGORY */
    static async updateCategory(categoryId,body){
        const response=await axios.put(`${this.BASE_URL}/category/update/${categoryId}`,body,{
            headers:this.getHeader()
        });
        return response.data;
    }

    /** BORRAR LA CATEGORY */
    static async deleteCategory(categoryId){
        const response=await axios.delete(`${this.BASE_URL}/category/delete/${categoryId}`,{
            headers:this.getHeader()
        });
        return response.data;
    }

    // ----------------------------------
    // ENDPOINTS PARA ORDER
    // ----------------------------------

    /** CREAR ORDER */
    static async createOrder(body){
        const response=await axios.post(`${this.BASE_URL}/order/create`,body,{
            headers:this.getHeader()
        });
        return response.data;
    }

    /** OBTENER TODAS LAS ORDER */
    static async getAllOrders(){
        const response=await axios.get(`${this.BASE_URL}/order/filter`,{
            headers:this.getHeader()
        });
        return response.data;
    }

    /** OBTENER ORDER ITEM BY ID*/
    static async getOrderItemById(itemId){
        const response=await axios.get(`${this.BASE_URL}/order/filter`,{
            headers:this.getHeader(),
            params:{itemId}
        });
        return response.data;
    }

    /** OBTENER ORDER ITEM BY STATUS*/
    static async getAllOrderItemsByStatus(status){
        const response=await axios.get(`${this.BASE_URL}/order/filter`,{
            headers:this.getHeader(),
            params:{status}
        });
        return response.data;
    }

    /** ACTUALIZAR EL STATUS */
    static async updateOrderItemStatus(orderItemId,status){
        const response=await axios.put(`${this.BASE_URL}/order/update-item-status/${orderItemId}`,{},{
            headers:this.getHeader(),
            params:{status}
        });
        return response.data;
    }


    // ----------------------------------
    // ENDPOINTS PARA ADDRESS
    // ----------------------------------

    /** INSERTAR O EDITAR ADDRESS */
    static async saveAndUpdateAddress(body){
        const response=await axios.post(`${this.BASE_URL}/address/save`,body,{
            headers:this.getHeader()
        });
        return response.data;
    }

    // ----------------------------------
    // VERIFICADOR DE AUTENTIFICACION
    // ----------------------------------

    /** CERRAR SESION */
    static logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("role")
    }
    
    /** MIRAR ES AUTENTIFICADO */
    static isAuthenticated(){
        const token=localStorage.getItem('token')
        return !!token  // !! SIRVE PARA DEVOLVER UN BOOLEAN 
    }

    /** SABER SI ES ADMIN */
    static isAdmin(){
        const role=localStorage.getItem('role')
        return role==="ADMIN" 
    }

}
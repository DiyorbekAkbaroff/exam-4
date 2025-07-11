import { globalError } from "shokhijakhon-error-handler"

export default {
    async MAIN_PAGE(req, res){
        try{
            let products = await req.readFile("products")
            return res.render("index", {jsFileName: "index", products})
        }catch(err){
            return globalError(err, res);
        }
    },
    async REGISTER_PAGE(req, res){
        try{
            return res.render("register", {jsFileName: "register"})
        }catch(err){
            return globalError(err, res);
        }
    },
    async LOGIN_PAGE(req, res){
        try{
            return res.render("login", {jsFileName: "login"})
        }catch(err){
            return globalError(err, res);
        }
    },
}
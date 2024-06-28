var backHost =
  process.env.REACT_APP_BACKEND_HOST != null
    ? process.env.REACT_APP_BACKEND_HOST
    : "https://localhost:44363";


export const endPoints = {
    //urlUSer
    urlAddNewUser: backHost +"/api/User",
    urlListAllUser:backHost + "/api/User ",
    urlUserCPF:backHost + "/api/User/getByCPF?cpf=",
    urlUserByid:backHost +  "/api/User",



   
    //UrlProduct
    urlProductAll:backHost+"/api/SalesProduct/Allproducts",
    urlAddNewProduct:backHost+"/api/SalesProduct/product",
    urlDeletProduct:backHost+"/api/Product",


    //UrlServices
    urlServiceAll: backHost +"/api/SalesProduct/AllServices",
    urlAddNewService:backHost+"/api/SalesProduct/service",

    //UrlSales
    urlNewSale:backHost + "/api/SalesOrder",

    //UrlBox
    urlOpenBox:backHost + "/api/CashierOrder/open?",
    urlGetBox:backHost +"/api/SalesOrder",
    urlCloseBox:backHost +"/api/CashierOrder/close",
    urlPutBox:backHost +"/api/CashierOrder",
  


   



   
    


    usuarioLogin: backHost + "/login",
    novoPedido: backHost + "/api/SalesOrder",
    cancelarPedido: backHost + "api/SalesOrder/",
    abriCaixa: backHost + "/api/open?",
    fecharCaixa: backHost + "/api/close?cashierId="

};
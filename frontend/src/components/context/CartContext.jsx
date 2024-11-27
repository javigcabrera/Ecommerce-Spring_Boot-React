import React,{createContext, useReducer, useContext, useEffect} from "react";

//CONTEXTO PARA MANEJAR EL ESTADO DEL CARRITO
const CartContext=createContext();

//DEFINE EL ESTADO INICIAL DEL CARRITO CARGANDO LOS DATOS DEL LOCAL STORAGE SI EXISTE
const initialState={
    cart:JSON.parse(localStorage.getItem('cart'))||[],
}

//SE DEFINE LA FUNCION REDUCTORA PARA GESTIONAR LAS ACCIONES DEL CARRITO
const cartReducer=(state,action)=>{
    //EVALUA QUE TIPO DE ACCION
    switch(action.type){
        //AGREGAR UN ITEM AL CARRITO
        case 'ADD_ITEM':{
            //BUSCA SI EL ITEM YA EXISTE EN EL CARRITO
            const existingItem=state.cart.find(item=>item.id===action.payload.id);
            let newCart;

            if(existingItem){
                //SI EXISTE INCREMENTA SU CANTIDAD
                newCart=state.cart.map(item=>
                    item.id===action.payload.id
                    ?{...item, quantity:item.quantity+1}
                    :item
                );
            }else{
                //SI NO EXISTE AGREGA AL CARRITO CON LA CANTIDAD INICIAL DE 1
                newCart=[...state.cart,{...action.payload,quantity:1}];
            }
            //ACTUALIZA EL CARRITO EN EL LOCALSTORAGE
            localStorage.setItem('cart',JSON.stringify(newCart));
            //SE DEVUELVE EL NUEVO ESTADO DEL CARRITO ACTUALIZADO
            return {...state,cart:newCart};
        }
        //ELIMINAR UN ITEM DEL CARRITO
        case 'REMOVE_ITEM':{
            //FILTRA LOS ELEMENTOS DEL CARRITO BORRANDO EL QUE COINCIDA CON EL ID DE ACTION PAYLOAD
            const newCart=state.cart.filter(item=>item.id!==action.payload.id);
            //ACTUALIZA EL CARRITO EN EL LOCAL STORGE
            localStorage.setItem('cart',JSON.stringify(newCart));
            //DEVUELVE EL NUEVO ESTADO DEL CARRITO SIN EL ITEM ELIMINADO
            return {...state,cart:newCart};
        }
        //INCREMENTA LA CANTIDAD DE UN ITEM EN EL CARRITO
        case 'INCREMENT_ITEM':{
            //CREA UN NUEVO CARRITO MAPEANDO EL ESTADO ACTUAL Y AUMENTANDO LA CANTIDAD DEL ITEM
            const newCart=state.cart.map(item=>
                item.id===action.payload.id
                ?{...item,quantity:item.quantity+1} //SI COINCIDE EL ID, INCREMENTA LA CANTIDAD
                :item //SI NO COINCIDE SE DEJA SIN CAMBIOS
            );
            //ACTUALIZA EL CARRITO EN EL LOCAL STORAGE
            localStorage.setItem('cart',JSON.stringify(newCart));
            //DEVUELVE EL NUEVO ESTADO DEL CARRITO ACTUALIZADO
            return {...state,cart:newCart};
        }
        //DISMINUIR LA CANTIDAD DE UN ITEM EN EL CARRITO
        case 'DECREMENT_ITEM':{
            //CREA UN NUEVO CARRITO MAPEANDO EL ESTADO ACTUAL Y DISMINUYENDO LA CANTIDAD DEL ITEM
            const newCart=state.cart.map(item=>
                item.id===action.payload.id&&item.quantity>1
                ?{...item,quantity:item.quantity-1}//SI COINCIDE EL ID, DISMINUYE LA CANTIDAD
                :item//SI NO COINCIDE SE DEJA SIN CAMBIOS
            );
            //ACTUALIZA EL CARRITO EN EL LOCAL STORAGE
            localStorage.setItem('cart',JSON.stringify(newCart));
            //DEVUELVE EL NUEVO ESTADO DEL CARRITO ACTUALIZADO
            return {...state,cart:newCart};
        }
        //VACIA EL CARRITO POR COMPLETO
        case 'CLEAR_CART':{
            //ELIMINA EL CARRITO DEL LOCAL STORAGE
            localStorage.removeItem('cart');
            //DEVUELVE EL NUEVO ESTADO DEL CARRITO ACTUALIZADO
            return {...state,cart:[]};
        }
        //SI NINGUNA ACCION COINCIDE RETORNA EL ESTADO ORIGINAL
        default:
            return state;
    }
};

//EXPORTA EL COMPONENTE CARTPROVIDER QUE PROPORCIONA EL CONTEXTO DEL CARRITO A LA APLICACIÓN
export const CartProvider=({children})=>{

    //USEREDUCER MANEJA EL ESTADO Y DESPACHA LAS ACCIONES USANDO CARTREDUCER E INICIALSTATE
    const [state, dispatch]=useReducer(cartReducer,initialState);

    //USEEFFECT ACTUALIZA EL CARRITO CADA VEZ QUE CAMBIA EL CARRITO
    useEffect(()=>{
        localStorage.setItem('cart',JSON.stringify(state.cart));
    },[state.cart])

    //DEVUELVE EL PROVIDER QUE PASA EL ESTADO Y EL DISPATCH A LOS COMPONENTES HIJOS
    return(
        <CartContext.Provider value={{cart:state.cart,dispatch}}>
            {children}
        </CartContext.Provider>
    )
}

//EXPORTA EL HOOK PERSONALIZADO USECART PARA FACILITAR EL ACCESO AL CONTEXTO DEL CARRITO
export const useCart = () => useContext(CartContext);
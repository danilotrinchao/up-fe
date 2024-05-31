import React ,{useState}from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TailSpin } from 'react-loader-spinner';
import Card from'../../components/Card';
import { login } from "../../services/UsuarioService";
import Menu from '../../components/menu';



const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

  
  
    const LogarUsuario = async () => {
      if (email == null || email == "") {
        console.log('erro')      
        return;
      } 
      if (password == null || password == "") {      
        console.log('erro')
        return;
      }
  

      console.log(email,password )
      
      //const vRetorno = await login({ email: email, senha: password });




      const LogarUsuario = async ({ email, senha }) => {
        const vRetorno = await login({ email: email, senha: senha });
        if (vRetorno.status && vRetorno.status === 200) {
            // Login bem-sucedido
            console.log('Login bem-sucedido:', vRetorno.data);
        } else {
            // Tratamento de erro
            console.error('Falha no login:', vRetorno.message);
        }
    };
  
    }
  
  
      
   
    return (
       

        
    <Card>
        <div className="card-header ">Login</div>
            <div className="card-body ">              
              <form  >
                <div className="form-group ">
                  <label >Email</label>
                  <input type="email" className="form-control my-2 mb-4" id="email"    value={email || ''}    onChange={(e) => setEmail(e.target.value)}   placeholder="Seu email" />              
                </div>
                <div className="form-group">
                  <label >Senha</label>
                  <input type="password" className="form-control my-2  mb-4" id="password"  value={password || ''}   onChange={(e) => setPassword(e.target.value)}  placeholder="Sua senha" />
                </div>                
                <div className="form-group text-center  m-0 mb-1">
                <button type="button"   onClick={ LogarUsuario}  class="btn btn-primary">Entrar</button>
                </div>             
                <div className="form-group text-center">            
               </div>               
              </form>
            </div>
    </Card> 
     
    );
};

export default Login;

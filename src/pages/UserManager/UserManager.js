import React, { useState, useEffect } from 'react';
import { Button, Tabs, Tab, Form, Alert, Modal } from 'react-bootstrap';
import Card from '../../components/Card';
import ModalComponent from '../../components/ModalComponet';
import UserForm from './componente/UserForm';
import UserTable from './componente/UserTable';
import '../../App.css';
import { FetchUser, NewUser, createDataObjectUser, deleteUserByID, editUser } from '../../services/functions/RequestPeople';

const UserManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pessoas, setPessoas] = useState([]);
  const [userValues, setUserValues] = useState({
    id: '',
    nome: '',
    sobrenome: '',
    email: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    endereco: {
       id: 0,
      cep: '',
      cidade: '',
      estado: '',
      bairro: '',
      numero: '',
    },
    role: '',
    password: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  const getRoleName = (userType) => {
    switch (userType) {
        case 'Cliente':
            return 1;
        case 'Admin':
            return  2;
        case 'Vendedor':
            return  3;
        case 'Caixa':
            return   4 ;
        default:
            return userType;
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('endereco.')) {
      const key = name.split('.')[1];
      setUserValues((prevValues) => ({
        ...prevValues,
        endereco: {
          ...prevValues.endereco,
          [key]: value,
        },
      }));
    } else {
      setUserValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleShowModal = () => {
    setUserValues({
      id: '',
      nome: '',
      sobrenome: '',
      email: '',
      dataNascimento: '',
      cpf: '',
      telefone: '',
      endereco: {
        
        cep: '',
        cidade: '',
        estado: '',
        bairro: '',
        numero: '',
      },
      role: '',
      password: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveUser = async () => {
    if (userValues.id) {
      const dataObject = {
        id: userValues.id.toString() ?? 0,
        nome: userValues.nome.toString() ?? '',
        sobrenome: userValues.sobrenome.toString() ?? '',
        dtNascimento: userValues.dataNascimento.toString() ?? '', // Certifique-se de que userValues.dataNascimento esteja no formato correto
        email: userValues.email.toString() ?? '',
        cpf: userValues.cpf.toString() ?? '',
        phone: userValues.telefone.toString() ?? '',
        userType: parseInt(getRoleName(userValues.role)) ?? parseInt(0), // Ajuste conforme necessário
        address: {
            id: parseInt(0), // Certifique-se de que está pegando o ID correto
            zipCode: userValues.endereco.cep.toString() ?? '',
            cityName: userValues.endereco.cidade.toString() ?? '',
            state: userValues.endereco.estado.toString() ?? '',
            road: userValues.endereco.bairro.toString() ?? '', // Corrigido para '' ao invés de 'bairro'
            number: parseInt(userValues.endereco.numero) || 0, // Converte para número ou define como 0 se não for válido
        },
        roleIds: [ "3fa85f64-5717-4562-b3fc-2c963f66afa6"], // Ajuste conforme a estrutura real de roleIds que deseja enviar
        password: userValues.password.toString() ?? '' // Certifique-se de que a senha é uma string
      };


      console.log(dataObject)
      await editUser(dataObject);
      await updateUsers();
    } else {
      const newDataUser = await createDataObjectUser(userValues);
   
     NewUser(newDataUser);
      await updateUsers();
    }
    handleCloseModal();
  };

  const handleEditUser = async (userData) => {
    setUserValues({
      id: userData.id ?? '',
      nome: userData.nome ?? '',
      sobrenome: userData.sobrenome ?? '',
      email: userData.email ?? '',
      dataNascimento: userData.dataNascimento ?? '',
      cpf: userData.cpf ?? '',
      telefone: userData.telefone ?? '',
      endereco: {
        id: 0,
        cep: userData.endereco?.cep ?? '',
        cidade: userData.endereco?.cidade ?? '',
        estado: userData.endereco?.estado ?? '',
        bairro: userData.endereco?.bairro ?? '',
        numero: userData.endereco?.numero ?? '',
      },
      role: userData.role ?? 'cliente',
      password:  userData.password,
    });
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    setShowDeleteModal(false);
    if (userToDelete) {
      await deleteUserByID(userToDelete.id);
      await updateUsers();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else {
      console.error('Objeto de usuário inválido:', userToDelete);
    }
  };

  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    updateUsers();
  }, []);

  const updateUsers = async () => {
    try {
        const data = await FetchUser();
        if (data && Array.isArray(data)) {
            const users = data.map((user) => {
                let roleName = '';
                switch (user.userType) {
                    case 1:
                        roleName = 'Cliente';
                        break;
                    case 2:
                        roleName = 'Admin';
                        break;
                    case 3:
                        roleName = 'Vendedor';
                        break;
                    case 4:
                        roleName = 'Caixa';
                        break;
                    default:
                        roleName = 'Unknown';
                }

                return {
                    id: user.id,
                    nome: user.nome,
                    sobrenome: user.sobrenome,
                    email: user.email,
                    dataNascimento: user.dtNascimento,
                    cpf: user.cpf,
                    telefone: user.phone,
                    role: roleName, // Assigning the readable role name
                    passwordHash: user.passwordHash // Including the passwordHash field
                };
            });
            
            setPessoas(users);
        } else {
            console.error('Dados recebidos não são válidos:', data);
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
};


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return pessoas.slice(indexOfFirstItem, indexOfLastItem);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card>
      <div className="card-header">Gerenciamento de Usuários</div>
      <div className="card-body">
        <Button variant="primary" onClick={handleShowModal}>
          Cadastrar Pessoa
        </Button>
        <ModalComponent show={showModal} onHide={handleCloseModal} title="Cadastrar Pessoa" save={handleSaveUser}>
       
          <UserForm userValues={userValues} handleInputChange={handleInputChange} />
        </ModalComponent>

        <Form.Group controlId="formSearch">
          <Form.Control
            type="text"
            placeholder="Buscar pessoa por nome"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>

        {showSuccessMessage && (
          <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
            Usuário excluído com sucesso!
          </Alert>
        )}

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação de Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja excluir o usuário {userToDelete && `${userToDelete.nome} ${userToDelete.sobrenome}`}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>

        <Tabs defaultActiveKey="clientes" id="user-tabs" className="mt-3">
          <Tab eventKey="clientes" title="Clientes">
            <UserTable
              users={getCurrentItems()}
              columns={['#', 'Nome', 'Sobrenome', 'Email', 'Data de Nascimento', 'CPF', 'Telefone', 'Role']}
              onEdit={handleEditUser}
              onDelete={handleShowDeleteModal}
            />
          </Tab>
        </Tabs>

        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(pessoas.length / itemsPerPage) }, (_, index) => (
              <li key={index} className="page-item">
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Card>
  );
};

export default UserManager;

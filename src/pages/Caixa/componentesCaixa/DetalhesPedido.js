import React, { useState, useEffect } from 'react';
import { FetchUserByID } from '../../../services/functions/RequestPeople';
import { PutCompletBox } from '../../../services/functions/RequestBox';
import { Form, Button } from 'react-bootstrap';

const DetalhesPedido = ({ pedido, onHide }) => {
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [desconto, setDesconto] = useState('');
  const [valorTotal, setValorTotal] = useState(0); // Novo estado para capturar o valor total do pedido
  const [paymentMethod, setPaymentMethod] = useState(''); // Novo estado para capturar o método de pagamento selecionado

  useEffect(() => {
    console.log(pedido);
    if (pedido && pedido.clientId) {
      FetchUserByID(pedido.clientId)
        .then(response => {
          setCliente(response);
        })
        .catch(error => {
          setErro('Erro ao buscar o cliente.');
          console.error(error);
        });
    }

    // Calcular o valor total do pedido apenas se houver produtos
    if (pedido && pedido.produto && pedido.produto.length > 0) {
      const total = pedido.produto.reduce((acc, prod) => acc + (prod.price * prod.quantity), 0);
      setValorTotal(total);
    } else {
      setValorTotal(0); // Define como zero se não houver produtos
    }
  }, [pedido]);

  const handleFormaPagamentoChange = (e) => {
    setFormaPagamento(e.target.value);
  };

  const handleDescontoChange = (e) => {
    setDesconto(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmarPagamento = () => {
    console.log('Forma de Pagamento:', formaPagamento);
    console.log('Desconto:', desconto);

    // Montando o objeto data conforme especificado
    const data = {
      id: pedido.id || '', // ID do pedido ou algum identificador único (tipagem: string)
      dtSale: new Date().toISOString(), // Data da venda (tipagem: string)
      produtos: pedido.produto.map(prod => ({
        productId: prod.productId || '', // ID do produto (tipagem: string)
        quantity: prod.quantity || 0, // Quantidade do produto (tipagem: number)
        orderId: prod.orderId || '', // ID do pedido (tipagem: string)
        productType: prod.productType || 0, // Valor fixo conforme especificado (tipagem: number)
        name: prod.name || '' // Nome do produto (tipagem: string)
      })),
      clientId: pedido.clientId || 0, // ID do cliente (tipagem: number)
      employeerId: pedido.employeerId || 0, // ID do empregado (tipagem: number)
      precoTotal: pedido.precoTotal || 0, // Preço total do pedido (tipagem: number)
      desconto: parseFloat(desconto) || 0, // Desconto (tipagem: number)
      credito: pedido.credito || 0, // Crédito (tipagem: number)
      saleStatus: pedido.saleStatus || 0, // Status da venda (tipagem: number)
      payments: [
        {
          id: 0, // ID do pagamento (se necessário) (tipagem: number)
          value: valorTotal || 0, // Valor total do pedido (tipagem: number)
          paymentMethod: paymentMethod || '', // Método de pagamento selecionado (tipagem: string)
          orderId: pedido.id || '' // ID do pedido (tipagem: string)
        }
      ]
    };

    // Chamar a função PutCompletBox com os dados montados
    PutCompletBox(data)
      .then(response => {
        console.log('Venda concluída com sucesso:', response.data);
        // Lógica adicional após a conclusão da venda, se necessário
      })
      .catch(error => {
        console.error('Erro ao concluir a venda:', error);
        // Lógica para tratamento de erro, se necessário
      });

    onHide();
  };

  return (
    <div>
      <div>
        <h5>Detalhes do Pedido</h5>
        <p>Cliente: {cliente ? cliente.nome : 'Carregando...'}</p>
        <p>Preço Total: R${pedido.precoTotal}</p>
        <h6>Produtos:</h6>
        {pedido.produto && pedido.produto.length > 0 ? (
          <ul>
            {pedido.produto.map((produto, index) => (
              <li key={index}>
                {produto.productType === 1 && (
                  <div>
                    <p>Detalhes do Produto:</p>
                    <p>Nome: {produto.name}</p>
                    <p>Quantidade: {produto.quantity}</p>
                  </div>
                )}
                {produto.productType === 2 && (
                  <div>
                    <p>Detalhes do Serviço:</p>
                    <p>Nome: {produto.name}</p>
                    <p>Quantidade: {produto.quantity}</p>
                    {/* Adicione outras informações específicas para serviço */}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum produto disponível.</p>
        )}
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </div>

      <Form>
        <Form.Group controlId="formaPagamento">
          <Form.Label>Forma de Pagamento</Form.Label>
          <Form.Control as="select" value={formaPagamento} onChange={handleFormaPagamentoChange}>
            <option value="">Selecione</option>
            <option value="cedulas">Cédulas</option>
            <option value="debito">Cartão de Débito</option>
            <option value="credito">Cartão de Crédito</option>
            <option value="pix">Pix</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="desconto">
          <Form.Label>Desconto</Form.Label>
          <Form.Control
            type="number"
            value={desconto}
            onChange={handleDescontoChange}
            placeholder="Desconto"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleConfirmarPagamento}>
          Confirmar Pagamento
        </Button>
      </Form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
};

export default DetalhesPedido;

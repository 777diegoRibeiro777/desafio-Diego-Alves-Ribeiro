import { cardapio } from './cardapio';

class CaixaDaLanchonete {
  constructor() {
    this.cardapio = cardapio; // Atribuindo o objeto 'cardapio' importado à propriedade 'cardapio' da classe
  }

  // Método para calcular o valor total da compra
  calcularValorDaCompra(formaDePagamento, itens) {
    // Verificando a validade da forma de pagamento
    if (!this.validarFormaDePagamento(formaDePagamento)) {
      return "Forma de pagamento inválida!";
    }

    // Verificando se há itens no carrinho
    if (!this.verificarItensNoCarrinho(itens)) {
      return "Não há itens no carrinho de compra!";
    }

    const itensPrincipais = new Set(); // Conjunto para armazenar códigos de itens principais
    let chantilyOuQueijo = false; // Variável para verificar se há chantily ou queijo no pedido
    let valorFinal = 0; // Inicializando o valor total da compra

    // Iterando pelos itens no carrinho
    for (const item of itens) {
      const [codigo, quantidade] = item.split(","); // Separando o código do item e a quantidade
      const menuItem = this.cardapio.get(codigo); // Obtendo o item do cardápio pelo código

      // Verificando a validade do item e sua quantidade
      if (!this.validarItem(menuItem, quantidade)) {
        if (quantidade == 0) {
          return "Quantidade inválida!";
        } else {
          return "Item inválido!";
        }
      }

      // Verificando se o item é chantily ou queijo
      if (codigo === "chantily" || codigo === "queijo") {
        chantilyOuQueijo = true;
      } else {
        itensPrincipais.add(codigo); // Adicionando o código do item principal ao conjunto
      }
    }

    // Calculando o valor total da compra
    for (const item of itens) {
      const [codigo, quantidade] = item.split(",");
      const menuItem = this.cardapio.get(codigo);

      valorFinal = valorFinal + menuItem.valor * quantidade; // Somando o valor do item multiplicado pela quantidade
    }

    // Verificando a validade do pedido com chantily ou queijo
    for (const item of itens) {
      const [codigo] = item.split(",");

      if (chantilyOuQueijo && ["chantily", "queijo"].includes(codigo)) {
        const principalCodigo = codigo === "chantily" ? "cafe" : "sanduiche";
        if (!itensPrincipais.has(principalCodigo)) {
          return "Item extra não pode ser pedido sem o principal";
        }
      }
    }

    // Aplicando descontos/acréscimos com base na forma de pagamento
    valorFinal = this.aplicarDescontosAcrescimos(formaDePagamento, valorFinal);

    // Formatando e retornando o valor final da compra
    return this.formatarValorFinal(valorFinal);
  }

  // Funções auxiliares
  validarFormaDePagamento(formaDePagamento) {
    const formasDePagamentoValidas = ["dinheiro", "debito", "credito"];
    return formasDePagamentoValidas.includes(formaDePagamento);
  }

  verificarItensNoCarrinho(itens) {
    return itens.length > 0;
  }

  validarItem(menuItem, quantidade) {
    return menuItem && quantidade > 0;
  }

  // Realiza descontos ou acréscimos a depender da forma de pagamento escolhida 
  aplicarDescontosAcrescimos(formaDePagamento, valorTotal) {
    if (formaDePagamento === "dinheiro") {
      valorTotal = valorTotal * 0.95; // 5% de desconto em dinheiro
    } else if (formaDePagamento === "credito") {
      valorTotal = valorTotal * 1.03; // 3% de acréscimo com cartão de crédito
    }
    
    return valorTotal;
  }

  // Formata o valor final da compra para exibição
  formatarValorFinal(valorFinal) {
    return `R$ ${valorFinal.toFixed(2).replace(".", ",")}`;
  }

}

// Exporta a classe CaixaDaLanchonete para uso em outros módulos
export { CaixaDaLanchonete };
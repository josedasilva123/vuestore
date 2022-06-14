const vm = new Vue({
    el: '#app',

    data: {
        carrinho: [],
        carrinhoAberto: false,
        produtoAtual: false,
        produtos: [],
        notificacao: false,
        total: 0,
    },

    filters: {
        toBRL(string){
            const format = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
            return string.toLocaleString('pt-BR', format);
        }
    },

    watch: {
        carrinho(valor){
            if(valor){
                const newTotal = valor.reduce((a, b) => {
                    return a + (b.preco * b.counter)
                }, 0);
                this.total = newTotal;
            } else {
                this.total = 0;
            }
        }
    },

    methods: {
        async fetchProdutos() {
            const response = await fetch('./api/produtos.json')
            const json = await response.json();
            this.produtos = json;
        },

        async fetchProdutoSelecionado(id){
            const response = await fetch(`./api/produtos/${id}.json`);
            const json = await response.json();
            this.produtoAtual = json;
        },
        
        notificar(texto, duracao){
            if(!this.notificao){
                this.notificao = texto;
                setTimeout(() => {
                    this.notificacao = false;
                }, duracao)
            }
        },

        toggleCarrinho(){
            this.carrinhoAberto = !this.carrinhoAberto;
        },

        incrementarCarrinho(produto){
            produto.counter = produto.counter + 1;  
        },

        adicionarCarrinho(produto){
            if(this.carrinho.find(p => p.id === produto.id)){
                produto.counter = produto.counter + 1;
                const newCarrinho = this.carrinho.filter(p => p.id !== produto.id);
                this.carrinho = [...newCarrinho, produto];
            } else {
                produto.counter = 1;
                this.carrinho.push(produto);
            }            
        },        

        removerCarrinho(produto){
            if(produto.counter > 1){
                produto.counter = produto.counter - 1;
                const newCarrinho = this.carrinho.filter(p => p.id !== produto.id);
                this.carrinho = [...newCarrinho, produto];
            } else {
                if(confirm("Tem certeza que deseja remover esse produto do carrinho?")){
                    const newList = this.carrinho.filter(p => p.id !== produto.id);
                    this.carrinho = newList;
                }
            }
        },

        resetProduto(){
            this.produtoAtual = false;
        }
    },

    created(){
        this.fetchProdutos();
    }
})
const vm = new Vue({
    el: '#app',
    data: {
        carrinho: [],
        carrinhoAberto: false,
        produtoAtual: false,
        produtos: [],
    },
    filters: {
        toBRL(string){
            const format = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
            return string.toLocaleString('pt-BR', format);
        }
    },
    watch: {
        carrinho(valor){
            console.log(valor);
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
                const newList = this.carrinho.filter(p => p.id !== produto.id);
                this.carrinho = newList;
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
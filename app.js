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
        produtoAtual(){
            document.title = this.produtoAtual.nome || "VueStore"
            const hash = this.produtoAtual.id || "";
            history.pushState(null,null, `#${hash}`);
        },
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
            if(!this.notificacao){
                this.notificacao = texto;
                setTimeout(() => {
                    this.notificacao = false;
                }, duracao)
            }
        },

        toggleCarrinho(){
            this.carrinhoAberto = !this.carrinhoAberto;
        },

        adicionarCarrinho(produto, desabilitarNotificação, index){
            const findProduct = this.carrinho.find(p => p.id === produto.id);

            function notificacaoSucesso(target){ 
                if(!desabilitarNotificação){
                    setTimeout(() => {
                        this.carrinhoAberto = true; 
                    }, 1600)
                    target.notificar(`${produto.nome} adicionado com sucesso!`, 1600); 
                }     
            }
            if(findProduct){
                const newCount = findProduct.counter + 1;

                if(newCount <= produto.estoque){
                    const newCarrinho = [...this.carrinho];
                    newCarrinho[index].counter = newCount;
                    this.carrinho = newCarrinho;
                    notificacaoSucesso(this);
                } else {
                    this.notificar(`Desculpe não temos ${produto.nome} suficiente em estoque!`, 1600); 
                }
               
            } else {
                produto.counter = 1;
                this.carrinho.push(produto);

                notificacaoSucesso(this);         
            }  
            
            
            this.produtoAtual = false; 
               
        },        

        removerCarrinho(produto, index){            
            if(produto.counter > 1){
                const newCarrinho = [...this.carrinho];
                newCarrinho[index].counter = produto.counter - 1;
                this.carrinho = newCarrinho;
            } else {
                if(confirm("Tem certeza que deseja remover esse produto do carrinho?")){
                    const newList = this.carrinho.filter(p => p.id !== produto.id);
                    this.carrinho = newList;
                    this.notificar(`${produto.nome} removido com sucesso!`, 1600);   
                }
            }
        },

        produtoOutclick(event){
            if(event.target === event.currentTarget){
                this.resetProduto();
            }
        },

        resetProduto(){
            this.produtoAtual = false;
        },

        router() {
            const hash = document.location.hash.replace('#', "");

            if(hash){
                this.fetchProdutoSelecionado(hash);
            }
        }
    },

    created(){
        this.fetchProdutos();
        this.router();
    }
})
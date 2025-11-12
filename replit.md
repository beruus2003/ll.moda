# Lara Moda - Loja Online de Roupas

## Visão Geral
Loja online de moda feminina e masculina "Lara Moda" com painel administrativo completo, sistema de autenticação duplo (clientes e admin), e integração com WhatsApp para vendas.

## Características Principais

### Funcionalidades MVP
- **Catálogo de Produtos**: Exibição de produtos com imagens, preços, tamanhos e cores
- **Sistema de Autenticação Duplo**:
  - Login de clientes (acesso no topo direito da página)
  - Login administrativo (acesso via menu hambúrguer)
- **Painel Administrativo Completo**:
  - Dashboard com estatísticas (total de produtos, pedidos, receita)
  - CRUD de produtos com upload de múltiplas imagens
  - Gerenciamento de pedidos e estoque
  - Ativar/desativar produtos
- **Upload de Imagens**: Sistema de upload de múltiplas imagens por produto armazenadas no banco de dados
- **Integração WhatsApp**: Botão para finalizar pedidos via WhatsApp
- **Filtros e Busca**: Sistema de filtros por categoria, busca por nome/descrição e ordenação

### Design
- **Paleta de Cores**: Tons de rosa inspirados na logo da Lara Moda
- **Tipografia**: Playfair Display (títulos) e Inter (corpo/UI)
- **Layout Responsivo**: Grid adaptativo (4→3→2 colunas conforme breakpoint)
- **Componentes**: Sistema baseado em Shadcn UI com customizações em rosa

## Tecnologias
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter (routing)
- **Backend**: Express.js, PostgreSQL (Neon), Drizzle ORM
- **Autenticação**: Replit Auth com roles (customer/admin)
- **State Management**: TanStack Query (React Query v5)
- **Upload**: Multer com armazenamento em banco de dados

## Estrutura do Projeto

### Schema de Dados
- **users**: Usuários com Replit Auth (id, email, firstName, lastName, role, profileImageUrl)
- **products**: Produtos (name, description, price, category, images[], colors[], sizes[], stock, isActive)
- **orders**: Pedidos (userId, status, paymentMethod, total, customerInfo, items)
- **cartItems**: Items do carrinho (opcional, para usuários logados)
- **sessions**: Gerenciamento de sessões Replit Auth

### Categorias de Produtos
- Feminino
- Masculino
- Conjuntos
- Outros (expandível)

## Fluxo de Usuário

### Cliente
1. Navega pelo catálogo de produtos
2. Visualiza detalhes do produto (galeria, cores, tamanhos)
3. Pode fazer login (opcional) via Replit Auth
4. Finaliza pedido via WhatsApp (envia detalhes do produto)

### Administrador
1. Faz login via menu hambúrguer (role: admin)
2. Acessa painel administrativo
3. Gerencia produtos (criar, editar, excluir, upload de imagens)
4. Visualiza estatísticas e pedidos
5. Atualiza status de pedidos

## Próximas Fases (Futuras)
- Sistema de carrinho de compras com checkout integrado
- Gateway de pagamento (PIX, cartão de crédito)
- Sistema de gestão de estoque com alertas
- Painel de relatórios e analytics
- Sistema de favoritos para clientes
- Busca avançada com filtros por preço, cor, tamanho
- Sistema de cupons de desconto

## Comandos Importantes
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run db:push`: Aplica schema do banco de dados
- `npm run build`: Build de produção

## Variáveis de Ambiente
- `DATABASE_URL`: URL de conexão PostgreSQL
- `SESSION_SECRET`: Secret para gerenciamento de sessões
- `ISSUER_URL`: URL do provedor OIDC (Replit Auth)
- `REPL_ID`: ID do Repl para autenticação

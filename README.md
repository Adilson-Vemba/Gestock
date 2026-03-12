# Gestock - Sistema de Gestão de Stock

Este projeto é um sistema de gestão de stock composto por um **Frontend** em Angular e um **Backend** em Node.js (Express) com MongoDB.

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [MongoDB](https://www.mongodb.com/try/download/community) (rodando localmente na porta padrão 27017)

## Estrutura do Projeto

* `/frontend`: Aplicação Angular.
* `/backend`: API Node.js/Express.

## Como Iniciar o Projeto

### 1. Configurar o Backend

1. Abra o terminal na pasta `backend`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
   O backend estará rodando em: `http://localhost:8080`

### 2. Configurar o Frontend

1. Abra um novo terminal na pasta `frontend`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm start
   ```
   A aplicação estará disponível em: `http://localhost:4200`

## Notas Importantes

* Certifique-se de que o seu serviço do **MongoDB** está ativo antes de iniciar o backend.
* O frontend está configurado para comunicar com o backend na porta 8080.

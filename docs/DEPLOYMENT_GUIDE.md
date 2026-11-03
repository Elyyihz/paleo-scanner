# 🚀 Guia Completo de Deploy do Paleo-Scanner

Este guia detalha o passo a passo para colocar a aplicação **Paleo-Scanner** (Frontend Angular 22 + Backend FastAPI + Modelo MobileNetV3 CNN) no ar em produção, cobrindo opções gratuitas na nuvem e servidores VPS dedicados.

---

## 🏗️ Como a Arquitetura de Deploy Funciona

O projeto suporta **duas modalidades de deploy**:

| Modalidade | Arquitetura | Cenário Recomendado |
|---|---|---|
| **Container Único (Unificado)** | `Dockerfile` na raiz compila o Angular no Stage 1 e o serve junto com a API FastAPI e a CNN no Stage 2. Porta dinâmica via `$PORT`. | **Render, Hugging Face Spaces, Railway, Fly.io, Google Cloud Run**. |
| **Multi-Container (Docker Compose)** | `docker-compose.yml` orquestrando o container `frontend` (Nginx Alpine) e o container `backend` (Uvicorn) na rede interna `paleo-network`. | **Servidores VPS (Ubuntu, Debian), AWS EC2, DigitalOcean Droplets**. |

---

## 🌐 Opção 1: Render (Web Service Gratuito) — *Recomendada*

O **Render** oferece hospedagem gratuita para containers Docker com SSL HTTPS automático.

### Passo a Passo:
1. Acesse [render.com](https://render.com) e crie/acesse sua conta.
2. No dashboard, clique em **New +** e selecione **Web Service**.
3. Conecte sua conta do GitHub e selecione o repositório `Elyyihz/paleo-scanner`.
4. Configure os parâmetros do serviço:
   * **Name**: `paleo-scanner` (ou o nome que preferir)
   * **Region**: *Ohio (US East)* ou *Frankfurt (EU Central)*
   * **Branch**: `main`
   * **Root Directory**: *(deixe em branco)*
   * **Runtime**: **Docker** (Render detectará automaticamente o `Dockerfile` na raiz)
   * **Instance Type**: **Free**
5. **Variáveis de Ambiente (Environment Variables)**:
   * Nenhuma variável é estritamente obrigatória, pois o `Dockerfile` detecta a variável `$PORT` atribuída dinamicamente pelo Render.
   * Se desejar forçar logs limpos:
     * `PYTHONUNBUFFERED` = `1`
     * `TF_USE_LEGACY_KERAS` = `1`
6. Clique em **Create Web Service**.
7. O Render executará o build multi-stage e disponibilizará sua aplicação em uma URL pública como `https://paleo-scanner.onrender.com`.

---

## 🤗 Opção 2: Hugging Face Spaces (Gratuito — 16 GB RAM)

Por se tratar de um projeto de inteligência artificial e visão computacional, o **Hugging Face Spaces** é uma das melhores opções gratuitas, oferecendo **16 GB de memória RAM** e **2 vCPUs** sem custo.

### Passo a Passo:
1. Crie uma conta em [huggingface.co](https://huggingface.co).
2. Vá em **Spaces** > **Create new Space**.
3. Dê um nome (ex: `paleo-scanner`) e selecione a licença (MIT).
4. Em **Select the Space SDK**, escolha **Docker** (Blank).
5. Escolha **Public** e clique em **Create Space**.
6. Conecte seu repositório:
   * Você pode configurar um GitHub Action para espelhar a branch `main` no repositório do Space:
   ```bash
   git remote add space https://huggingface.co/spaces/SEU_USUARIO/paleo-scanner
   git push space main
   ```
7. O Hugging Face construirá o `Dockerfile` e disponibilizará o app online.

---

## 🚂 Opção 3: Railway (Deploy Instantâneo)

1. Acesse [railway.app](https://railway.app) e faça login com seu GitHub.
2. Clique em **New Project** > **Deploy from GitHub repo**.
3. Selecione o repositório `Elyyihz/paleo-scanner`.
4. O Railway detectará o `Dockerfile` da raiz automaticamente.
5. Em **Settings** > **Networking**, clique em **Generate Domain** para gerar uma URL pública `.up.railway.app`.

---

## ✈️ Opção 4: Fly.io

1. Instale o CLI do Fly.io no seu terminal:
   ```bash
   brew install flyctl   # macOS
   ```
2. Faça login:
   ```bash
   fly auth login
   ```
3. Na pasta do projeto:
   ```bash
   fly launch --generate-name
   ```
   *(O Fly.io detectará o `Dockerfile` na raiz e gerará o arquivo `fly.toml`)*.
4. Execute o deploy:
   ```bash
   fly deploy
   ```

---

## 🖥️ Opção 5: Servidor Próprio / VPS (Ubuntu / Debian / DigitalOcean / AWS)

Para executar em uma VPS própria utilizando a orquestração Nginx + FastAPI:

### 1. Clonar o Repositório no Servidor
```bash
git clone https://github.com/Elyyihz/paleo-scanner.git
cd paleo-scanner
```

### 2. Configurar Variáveis de Porta (Opcional)
Se as portas padrão `8000` ou `4200` já estiverem em uso por outros serviços:
```bash
cp .env.example .env
# Edite as portas desejadas no .env (ex: BACKEND_PORT=8001 e FRONTEND_PORT=4201)
```

### 3. Iniciar os Containers em Segundo Plano
```bash
docker compose up -d --build
```

### 4. Verificar o Status dos Serviços
```bash
docker compose ps
docker compose logs -f
```

### 5. Configurar SSL / HTTPS com Nginx do Host ou Certbot
Se estiver apontando um domínio (ex: `paleoscanner.com`), crie uma regra de proxy reverso no Nginx da VPS direcionando para a porta do frontend (`http://localhost:4200`).

---

## 🛠️ Resolução de Problemas Frequentes (Troubleshooting)

### 1. Erro de versão do TensorFlow (`tensorflow-cpu not found`)
* **Causa**: O pacote `tensorflow-cpu` só existe para processadores `x86_64`. Em servidores ARM64 (AWS Graviton, Apple Silicon, Oracle Ampere), o pip falha ao procurá-lo.
* **Solução**: O arquivo `backend/requirements.txt` foi configurado com seletores de plataforma PEP 508:
  ```text
  tensorflow-cpu>=2.15.0; platform_machine == "x86_64"
  tensorflow>=2.15.0; platform_machine != "x86_64"
  ```

### 2. Conflito de Portas (`port is already allocated`)
* **Causa**: Outro container ou aplicação já está usando a porta `8000` ou `4200` no host.
* **Solução**: Defina portas alternativas no arquivo `.env` (ex: `BACKEND_PORT=8080`, `FRONTEND_PORT=4205`) ou suba a imagem unificada:
  ```bash
  docker run -p 8080:8000 paleo-scanner:latest
  ```

### 3. Requisições da API falhando no navegador após o deploy
* **Causa**: A aplicação estava tentando se comunicar com `http://127.0.0.1:8000`, que aponta para o computador local do visitante e não para o servidor remoto.
* **Solução**: O serviço [`dinosaur-api.service.ts`](file:///Users/elyyihz/repositories/personal/paleo-scanner/frontend/src/app/core/services/dinosaur-api.service.ts) foi atualizado para detectar dinamicamente se a aplicação está em produção e utilizar URLs relativas (`/api/v1` e `/static`), funcionando em qualquer domínio sem necessidade de recompilação.

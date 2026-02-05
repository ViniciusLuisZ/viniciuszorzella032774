Projeto Full Stack – Gerenciamento de Artistas e Álbuns
📌 Visão Geral

Aplicação full stack para gerenciamento de artistas e seus álbuns, permitindo cadastro, edição, listagem, upload de capas e visualização de imagens armazenadas em serviço compatível com S3 (MinIO).

O projeto foi desenvolvido conforme os requisitos do ANEXO II-C – Projeto Prático Full Stack Sênior, utilizando Java (Spring Boot) no backend e Angular no frontend, com ambiente totalmente containerizado via Docker Compose.

🧱 Arquitetura
┌──────────────┐
│   Frontend   │ Angular + Tailwind
│  (Port 4200) │
└───────┬──────┘
        │ HTTP + JWT
┌───────▼──────┐
│    Backend   │ Spring Boot
│  (Port 8080) │
└───┬─────┬────┘
    │     │
    │     └──────────┐
    │                │
┌───▼────┐      ┌────▼────┐
│Postgres│      │  MinIO  │
│  5432  │      │9000/9001│
└────────┘      └─────────┘

Tecnologias

Backend: Java 21, Spring Boot, Spring Security, JWT, Flyway

Frontend: Angular (standalone), TypeScript, Tailwind CSS

Banco de Dados: PostgreSQL

Storage: MinIO (S3 compatible)

Infra: Docker + Docker Compose

Documentação: OpenAPI / Swagger

🚀 Como executar o projeto
Pré-requisitos

Docker

Docker Compose

Subindo a aplicação

Na raiz do projeto:

docker compose up --build

URLs

Frontend: http://localhost:4200

API: http://localhost:8080

Swagger: http://localhost:8080/swagger-ui.html

Health Check: http://localhost:8080/actuator/health

MinIO Console: http://localhost:9001

Usuário: minioadmin

Senha: minioadmin

🔐 Autenticação

A aplicação utiliza JWT:

Token de acesso com expiração de 5 minutos

Endpoint de refresh token disponível

Frontend gerencia expiração e renovação automaticamente

📦 Funcionalidades Implementadas
Backend

CRUD de artistas

CRUD de álbuns

Paginação e ordenação

Consulta de álbuns por artista

Upload de imagens de capa

Armazenamento no MinIO

Recuperação de imagens via presigned URLs (expiração de 30 minutos)

Versionamento de endpoints (/api/v1)

Migrations com Flyway

Rate limit: 10 requisições/minuto por usuário

Health checks (liveness/readiness)

Documentação OpenAPI

Frontend

Autenticação obrigatória

Listagem de artistas com busca, ordenação e paginação

Tela de detalhe do artista com álbuns

Cadastro e edição de artistas e álbuns

Upload de capas

Layout responsivo

Arquitetura com Facade + BehaviorSubject

Lazy loading de rotas

⚠️ Requisito não implementado
WebSocket (notificação de novos álbuns)

O requisito de WebSocket para notificação em tempo real de novos álbuns não foi implementado por limitação de tempo.

A decisão foi priorizar:

estabilidade da API

segurança (JWT + rate limit)

upload e recuperação correta de imagens

arquitetura limpa e funcional

A implementação planejada seria:

Backend: WebSocket com STOMP (/topic/albums)

Frontend: Listener para exibição de notificações em tempo real

🧠 Decisões Técnicas Relevantes

Separação entre endpoint interno e público do MinIO para evitar problemas de assinatura em presigned URLs.

Uso de Docker para garantir ambiente reproduzível.

Facade no frontend para desacoplamento de componentes e serviços.

JWT stateless com refresh para maior segurança.

Rate limit aplicado no backend para proteção da API.

🧪 Testes

Devido ao prazo, testes unitários não foram priorizados.
A estrutura da aplicação permite fácil inclusão de testes futuros, especialmente em:

Services

Security

Controllers

📄 Considerações Finais

O projeto foi desenvolvido com foco em:

clareza arquitetural

aderência aos requisitos principais

boas práticas de desenvolvimento full stack

facilidade de execução e avaliação
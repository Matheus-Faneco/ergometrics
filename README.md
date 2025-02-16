# Ergo+

## Descrição

Este projeto está sendo desenvolvido para a Feira de Mostra Tecnológica da Escola Tecnológica da FPFtech. O **Ergo+** é um monitorador de postura voltado para empresas, com o objetivo de promover a saúde e o bem-estar dos colaboradores, ajudando a prevenir problemas posturais durante o expediente de trabalho.

## Estado da Aplicação

O desenvolvimento da aplicação está em andamento. O **front-end** está sendo desenvolvido no **Angular**, com funcionalidades ainda em fase de implementação e ajustes.

### Docker

Há um **Dockerfile** do front-end pronto para ser buildado com a imagem da aplicação. Caso tenha interesse em rodar a aplicação localmente.

1. Execute o comando no terminal para criar a imagem do Docker:
   ```
   docker build -t <nome-da-imagem> .
2. Para criar o container:
   ```
   docker run -p 80:80 <nome-da-imagem>



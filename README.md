# Digital Twin - EMC

Bem-vindo ao projeto de Gêmeos Digitais da EMC! Este repositório contém todos os arquivos necessários para configuração dos serviços.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Início Rápido

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/antonio-emilio/digital-twin-emc.git
    cd digital-twin-emc
    ```

2. **Construa e Inicie os Contêineres:**

    Execute o seguinte comando para configurar e iniciar o projeto:

    ```bash
    docker-compose up -d
    ```

    Isso fará o download das imagens necessárias e iniciará os contêineres em segundo plano.

3. **Acesse Sua Aplicação:**

    - Grafana: [http://localhost:3000](http://localhost:3000)
    - InfluxDB: [http://localhost:8086](http://localhost:8086)
    - Mosquitto: [http://localhost:1883](http://localhost:1883)
    - Ditto: [http://localhost:8080](http://localhost:8080)
    - Kafka: [http://localhost:9092](http://localhost:9092)

## Parando a Aplicação

Para parar os contêineres em execução:

  ```bash
  docker-compose down
    ```
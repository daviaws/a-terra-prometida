# A Terra Prometida

Uma iniciativa Open Source para engajar comunidades em espaços virtuais.
Junte-se ao Discord: https://discord.gg/ZrH55pyB 

# Demos
[Introdução](https://youtu.be/ZaHQknMooa8)
[Stream Audio e Vídeo](https://youtu.be/H_sXqbYX_0Q)

# Pre requisitos

Para prosseguir com este projeto nós assumimos que você tenha instalado:
  * Docker Desktop
  * Mix (Elixir)
  * ffmpeg
  * Conta e Token gerado em Mux: https://dashboard.mux.com/

## Executando

Para iniciar o seu servidor Phoenix:
  * Execute `docker-compose up -d` para iniciar as dependências (banco de dados).
  * Execute `mix setup` para instalar e configurar as dependências.
  * Inicie o endpoint do Phoenix com `mix phx.server` ou dentro do IEx com `iex -S mix phx.server`.

Agora você pode visitar [`localhost:4000`](http://localhost:4000) no seu navegador.

Pronto para executar em produção? Por favor, [verifique nossos guias de implantação](https://hexdocs.pm/phoenix/deployment.html).

## Artigos
  * https://dockyard.com/blog/2020/09/25/live-streaming-with-liveview-and-mux-in-under-70-lines-of-code

## Saiba mais

  * Website oficial: https://www.phoenixframework.org/
  * Guias: https://hexdocs.pm/phoenix/overview.html
  * Documentação: https://hexdocs.pm/phoenix
  * Fórum: https://elixirforum.com/c/phoenix-forum
  * Código-fonte: https://github.com/phoenixframework/phoenix
  * Phoenix LiveView: https://hexdocs.pm/phoenix_live_view/
  * Exercism: https://exercism.org/tracks/elixir

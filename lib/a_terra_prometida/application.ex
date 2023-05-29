defmodule ATerraPrometida.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      ATerraPrometidaWeb.Telemetry,
      # Start the Ecto repository
      ATerraPrometida.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: ATerraPrometida.PubSub},
      # Start Finch
      {Finch, name: ATerraPrometida.Finch},
      # Start the Endpoint (http/https)
      ATerraPrometidaWeb.Endpoint
      # Start a worker by calling: ATerraPrometida.Worker.start_link(arg)
      # {ATerraPrometida.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ATerraPrometida.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ATerraPrometidaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end

defmodule ATerraPrometida.Repo do
  use Ecto.Repo,
    otp_app: :a_terra_prometida,
    adapter: Ecto.Adapters.Postgres
end

defmodule App.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION citext", "DROP EXTENSION citext"

    create table(:users) do
      add :username, :citext
      add :name, :string
      add :status, :string
      add :direction, :string
      add :latitude, :integer
      add :longitude, :integer

      timestamps()
    end

    create unique_index(:users, [:username])
  end
end

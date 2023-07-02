defmodule App.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `App.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        direction: :up,
        status: :online,
        latitude: 42,
        longitude: 42,
        name: "some name",
        username: "SomeUsername"
      })
      |> App.Accounts.create_user()

    user
  end
end

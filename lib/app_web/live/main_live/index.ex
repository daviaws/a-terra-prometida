defmodule AppWeb.MainLive.Index do
  use AppWeb, :live_view

  alias AppWeb.Presence
  alias App.PubSub
  alias App.Accounts

  @presence "main-stage:presence"
  @change_coordinate "main-stage:change_coordinate"
  @change_direction "main-stage:change_direction"

  @impl true
  def render(assigns) do
    ~H"""
    <div class="w-full h-screen flex flex-col">
      <div class="flex-1 flex">
        <div
          id="world-stage"
          phx-update="ignore"
          data-user-id={@current_user.id}
          phx-hook="WorldStage"
          class="flex-1 relative overflow-hidden"
        >
        </div>
        <div class=" bg-violet-900 w-64 border-l border-violet-600"></div>
      </div>

      <header class="px-4 bg-violet-900 sm:px-6 lg:px-8 border-t border-violet-600">
        <div class="flex items-center justify-between border-b border-zinc-100 py-3 text-sm">
          <div class="flex items-center gap-4">
            <a href="/">
              <img src={~p"/images/logo.svg"} width="36" />
            </a>
            <p class="bg-brand/5 text-brand rounded-full px-2 font-medium leading-6">
              v<%= Application.spec(:phoenix, :vsn) %>
            </p>
          </div>
          <div class="flex items-center gap-4 font-semibold leading-6 text-zinc-900">
            <a href="https://twitter.com/elixirphoenix" class="hover:text-zinc-700">
              @elixirphoenix
            </a>
            <a href="https://github.com/phoenixframework/phoenix" class="hover:text-zinc-700">
              GitHub
            </a>
            <a
              href="https://hexdocs.pm/phoenix/overview.html"
              class="rounded-lg bg-zinc-100 px-2 py-1 hover:bg-zinc-200/80"
            >
              Get Started <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </header>
    </div>
    """
  end

  def encode(user) do
    %{
      id: user.id,
      name: user.name,
      username: user.username,
      status: user.status,
      position: %{x: user.latitude, y: user.longitude},
      direction: user.direction
    }
  end

  defp sign_in(username, socket) do
    {:ok, user} = Accounts.create_user(%{username: username, name: username})

    socket
    |> assign(:current_user, user)
  end

  @impl true
  def mount(params, session, socket) do
    username = params["username"] || "Guest::#{session["_csrf_token"]}"
    socket = sign_in(username, socket)
    current_user = socket.assigns.current_user

    if connected?(socket) do
      {:ok, _} =
        Presence.track(self(), @presence, current_user.id, %{joined_at: :os.system_time(:seconds)})

      Phoenix.PubSub.subscribe(PubSub, @presence)
      Phoenix.PubSub.subscribe(PubSub, @change_coordinate)
      Phoenix.PubSub.subscribe(PubSub, @change_direction)
    end

    {:ok,
     socket
     |> assign(:current_user, current_user)
     |> assign(:users, %{})
     |> handle_joins(Presence.list(@presence))}
  end

  defp handle_joins(socket, joins) do
    user_ids = Map.keys(joins)

    Enum.reduce(user_ids, socket, fn user_id, socket ->
      user = Accounts.get_user!(user_id)

      socket
      |> push_event("user_join", %{
        user: encode(user)
      })
    end)
  end

  defp handle_leaves(socket, leaves) do
    Enum.reduce(leaves, socket, fn {user, _}, socket ->
      assign(socket, :users, Map.delete(socket.assigns.users, user))
      |> push_event("user_leave", %{user_id: user})
    end)
  end

  @impl true
  def handle_info(%Phoenix.Socket.Broadcast{event: "presence_diff", payload: diff}, socket) do
    {
      :noreply,
      socket
      |> handle_leaves(diff.leaves)
      |> handle_joins(diff.joins)
    }
  end

  # @impl true
  def handle_info(
        {:change_coordinate,
         %{"x" => x, "y" => y, "direction" => direction, "user_id" => user_id}},
        socket
      ) do
    user = socket.assigns.current_user

    socket =
      if user.id == user_id do
        socket
      else
        socket
        |> push_event("change_coordinate", %{x: x, y: y, direction: direction, user_id: user_id})
      end

    {:noreply, socket}
  end

  @impl true
  def handle_info(
        {:change_direction, params},
        socket
      ) do
    user = socket.assigns.current_user
    %{"user_id" => user_id, "direction" => direction} = params

    socket =
      if user.id == user_id do
        socket
      else
        socket
        |> push_event("change_direction", %{direction: direction})
      end

    {:noreply, socket}
  end

  @impl true
  def handle_event("ready", _params, socket) do
    user_ids =
      Presence.list(@presence)
      |> Map.keys()

    users =
      Accounts.list_users()
      |> Enum.filter(fn user -> user.id in user_ids end)
      |> Enum.map(fn user -> encode(user) end)

    {:noreply,
     socket
     |> push_event("users", %{users: users})}
  end

  @impl true
  def handle_event(
        "change_my_coordinate",
        %{"x" => x, "y" => y, "direction" => direction} = params,
        socket
      ) do
    user = socket.assigns.current_user

    {:ok, _} = Accounts.update_user(user, %{latitude: x, longitude: y, direction: direction})

    coordinate = Map.merge(params, %{"user_id" => user.id})

    Phoenix.PubSub.broadcast(
      PubSub,
      @change_coordinate,
      {:change_coordinate, coordinate}
    )

    {:noreply, socket |> push_event("change_coordinate", coordinate)}
  end

  @impl true
  def handle_event("change_my_direction", %{"direction" => direction} = params, socket) do
    user = socket.assigns.current_user

    {:ok, _} = Accounts.update_user(user, %{direction: direction})

    direction = Map.merge(params, %{"user_id" => user.id})

    Phoenix.PubSub.broadcast(
      PubSub,
      @change_direction,
      {:change_direction, direction}
    )

    {:noreply, socket |> push_event("change_direction", direction)}
  end
end

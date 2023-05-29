defmodule ATerraPrometidaWeb.ATerraPrometidaLive do
  use ATerraPrometidaWeb, :live_view

  require Logger

  alias Phoenix.LiveView

  @step 3

  @impl LiveView
  def mount(_params, _session, socket) do
    {:ok,
     assign(socket,
       page_title: "A Terra Prometida",
       version: "0.0.0",
       version_slug: "Genesis",
       scene_path: "images/scene.png",
       actor_sheet: "images/naruto-sheet-alpha.png",
       x: 800,
       y: 600,
       state: "move"
     )}
  end

  @impl LiveView
  def handle_event("key_down", %{"key" => "ArrowUp"}, socket) do
    {:noreply, assign(socket, state: "move-up", y: socket.assigns.y - @step)}
  end

  def handle_event("key_down", %{"key" => "ArrowDown"}, socket) do
    {:noreply, assign(socket, state: "move-down", y: socket.assigns.y + @step)}
  end

  def handle_event("key_down", %{"key" => "ArrowLeft"}, socket) do
    {:noreply, assign(socket, state: "move-left", x: socket.assigns.x - @step)}
  end

  def handle_event("key_down", %{"key" => "ArrowRight"}, socket) do
    {:noreply, assign(socket, state: "move-right", x: socket.assigns.x + @step)}
  end

  @impl LiveView
  def handle_event(event, params, socket) do
    Logger.warning(
      "Not handled #{event} with params #{inspect(params)} and assings #{inspect(socket.assigns)}"
    )

    {:noreply, socket}
  end
end

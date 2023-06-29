defmodule ATerraPrometidaWeb.ATerraPrometidaLive do
  use ATerraPrometidaWeb, :live_view

  require Logger

  alias Phoenix.LiveView

  @step 3

  @impl LiveView
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> mount_video_stream()
     |> mount_world_state()}
  end

  @impl true
  def handle_event(
        "video_data",
        %{"data" => "data:video/x-matroska;codecs=avc1,opus;base64," <> data},
        socket
      ) do
    ffmpeg_send_input!(socket, data)

    {:noreply, socket}
  end

  def handle_event(
        "video_data",
        %{"data" => "data:video/webm; codecs=\"vp8, opus\";base64," <> data},
        socket
      ) do
    ffmpeg_send_input!(socket, data)

    {:noreply, socket}
  end

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

  def handle_event(event, params, socket) do
    Logger.warning(
      "Not handled #{event} with params #{inspect(params)} and assings #{inspect(socket.assigns)}"
    )

    {:noreply, socket}
  end

  defp mount_video_stream(socket) do
    stream_key = "mystream"
    socket
    |> assign(:ffmpeg_process, spawn_ffmpeg(stream_key))
  end

  defp mount_world_state(socket) do
    socket
    |> assign(:page_title, "A Terra Prometida")
    |> assign(:version, "0.0.0")
    |> assign(:version_slug, "Genesis")
    |> assign(:scene_path, "images/scene.png")
    |> assign(:actor_sheet, "images/naruto-sheet-alpha.png")
    |> assign(:x, 800)
    |> assign(:y, 600)
    |> assign(:state, "move")
  end

  defp spawn_ffmpeg(key) do
    # Copied from https://github.com/MuxLabs/wocket/blob/master/server.js
    ffmpeg_args =
      ~w(-i - -c:v libx264 -b:a 32k -b:v 100k -f flv -g 5 -r 5 -s 426x240 -preset ultrafast -profile:v baseline)

    Porcelain.spawn("ffmpeg", ffmpeg_args ++ ["rtmp://localhost:1935/stream/#{key}"])
  end

  defp ffmpeg_send_input!(socket, data) do
    if socket.assigns.ffmpeg_process do
      Logger.info("[#{__MODULE__}] streaming data to porcelain/ffmpeg/rtmp server")
      Porcelain.Process.send_input(socket.assigns.ffmpeg_process, Base.decode64!(data))
    else
      Logger.warning("[#{__MODULE__}] RTMP server not configured")
    end
  end
end

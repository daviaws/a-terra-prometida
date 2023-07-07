defmodule AppWeb.RoomController do
  use AppWeb, :controller

  def index(conn, %{"room_id" => id, "display_name" => _name}) do
    render(conn, "index.html", room_id: id)
  end

  # display name is not present, redirect to home page with filled in room name
  def index(conn, %{"room_id" => id}) do
    redirect(conn, to: Routes.video_room_path(conn, :index, %{room_id: id}))
  end
end

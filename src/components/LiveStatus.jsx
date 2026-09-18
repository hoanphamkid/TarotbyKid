import { Clock3, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function formatTime(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export default function LiveStatus() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [online, setOnline] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setTime(formatTime(new Date())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    const key = crypto.randomUUID();
    const channel = supabase.channel("hptarot-online", {
      config: { presence: { key } },
    });
    const updatePresence = () =>
      setOnline(Object.keys(channel.presenceState()).length);
    channel
      .on("presence", { event: "sync" }, updatePresence)
      .on("presence", { event: "join" }, updatePresence)
      .on("presence", { event: "leave" }, updatePresence)
      .subscribe((status) => {
        if (status === "SUBSCRIBED")
          channel.track({ online_at: new Date().toISOString() });
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <aside className="live-status" aria-label="Trạng thái trực tuyến">
      <span>
        <UsersRound size={14} />
        {online === null ? "Đang kết nối" : `${online} đang online`}
      </span>
      <span>
        <Clock3 size={14} />
        {time}
      </span>
    </aside>
  );
}

import { createRoot, createEffect, createSignal } from "solid-js";
import tmi, { Client } from "tmi.js";
import pkg from "./pkg";
import { types, Option, None } from "@macrograph/core";
import { helix, user } from "./helix";

const { client } = createRoot(() => {
  const [client, setClient] = createSignal<Option<Client>>(None);

  createEffect(() =>
    setClient(
      user().map((user) => {
        const client = tmi.Client({
          channels: [user.name],
          identity: {
            username: user.name,
            password: user.token,
          },
        });

        client.connect();

        client.on("connected", () => console.log("connected"));

        client.on("message", (_, tags, message, self) => {
          const data = { message, tags, self };
          pkg.emitEvent({ name: "chatMessage", data });
        });

        return client;
      })
    )
  );

  return { client };
});

export { client };

pkg.createNonEventSchema({
  name: "Send Chat Message",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "message",
      name: "Message",
      type: types.string(),
    });
  },
  run({ ctx }) {
    const c = client().unwrap();

    c.say(c.getUsername(), ctx.getInput("message"));
  },
});

pkg.createNonEventSchema({
  name: "Emote Only Mode",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "enabled",
      type: types.bool(),
    });
  },
  run({ ctx }) {
    const [c, h] = client().zip(helix()).unwrap();

    h.chat.updateSettings(c.getUsername(), c.getUsername(), {
      emoteOnlyModeEnabled: ctx.getInput("enabled"),
    });
  },
});

pkg.createEventSchema({
  name: "Chat Message",
  event: "chatMessage",
  generateIO: (t) => {
    t.execOutput({
      id: "exec",
    });
    t.dataOutput({
      id: "username",
      name: "Username",
      type: types.string(),
    });
    t.dataOutput({
      id: "displayName",
      name: "Display Name",
      type: types.string(),
    });
    t.dataOutput({
      id: "userId",
      name: "User ID",
      type: types.string(),
    });
    t.dataOutput({
      id: "message",
      name: "Message",
      type: types.string(),
    });
    t.dataOutput({
      id: "mod",
      name: "Moderator",
      type: types.bool(),
    });
    t.dataOutput({
      id: "sub",
      name: "Subscriber",
      type: types.bool(),
    });
    t.dataOutput({
      id: "vip",
      name: "VIP",
      type: types.bool(),
    });
  },
  run({ ctx, data }) {
    if (data.self) return;
    ctx.setOutput("username", data.tags.username);
    ctx.setOutput("displayName", data.tags["display-name"]);
    ctx.setOutput("userId", data.tags["user-id"]);
    ctx.setOutput("message", data.message);
    ctx.setOutput("mod", data.tags.mod);
    ctx.setOutput("sub", data.tags.subscriber);
    ctx.setOutput("vip", data.tags.vip);
    ctx.exec("exec");
  },
});
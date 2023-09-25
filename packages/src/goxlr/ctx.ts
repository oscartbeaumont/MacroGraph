import { Maybe, OnEvent, Option } from "@macrograph/core";
import { createEffect, createSignal, on, onCleanup } from "solid-js";
import { WebsocketResponse } from "./types";

const URL_LOCALSTORAGE_KEY = "GoXLR_WS";

export type Ctx = ReturnType<typeof createCtx>;

export function createCtx(onEvent: OnEvent) {
  const [state, setState] = createSignal<
    | {
        type: "disconnected";
      }
    | { type: "connecting" | "connected"; ws: WebSocket }
  >({ type: "disconnected" });

  const [url, setUrl] = createSignal<Option<string>>(
    Maybe(localStorage.getItem("GoXLR_WS") || null)
  );

  let mixerID: string | undefined;

  createEffect(
    on(
      () => url(),
      (url) =>
        url
          .map((url) => (localStorage.setItem(URL_LOCALSTORAGE_KEY, url), true))
          .unwrapOrElse(
            () => (localStorage.removeItem(URL_LOCALSTORAGE_KEY), false)
          )
    )
  );

  createEffect(
    on(
      () => url(),
      (url) => {
        url.map((url) => {
          const ws = new WebSocket(url);

          ws.addEventListener("open", () => {
            setState({ type: "connected", ws });
            ws.send(
              JSON.stringify({
                id: 0,
                data: "GetStatus",
              })
            );
          });

          ws.addEventListener("message", (msg) => {
            const { data }: WebsocketResponse = JSON.parse(msg.data);
            if (data === "Ok") return;

            if ("Status" in data) {
              mixerID = Object.keys(data.Status.mixers)[0];
              console.log(mixerID);
              return;
            } else if ("Patch" in data) {
              for (const op of data.Patch) {
                const pathParts = op.path.substring(1).split("/");

                if (op.op !== "add" && op.op !== "replace") return;

                switch (pathParts[2]) {
                  case "levels": {
                    onEvent({
                      name: "levelsChange",
                      data: {
                        channel: pathParts[4]!,
                        value: Math.round(op.value),
                      },
                    });
                    break;
                  }
                  case "button_down": {
                    onEvent({
                      name: "buttonDown",
                      data: { buttonName: pathParts[3]!, state: op.value },
                    });
                    break;
                  }
                  case "fader_status": {
                    onEvent({
                      name: "faderStatus",
                      data: { channel: pathParts[3]!, state: op.value },
                    });
                    break;
                  }
                }
              }
            }
          });

          setState({ type: "connecting", ws });

          onCleanup(() => {
            ws.close();
            setState({ type: "disconnected" });
          });
        });
      }
    )
  );

  return { mixerID: () => mixerID, url, setUrl, state, setState };
}

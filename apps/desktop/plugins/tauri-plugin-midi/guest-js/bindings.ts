         // This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

         export const commands = {
async openInput(name: string) : Promise<null> {
return await TAURI_INVOKE("plugin:midi|open_input", { name });
},
async closeInput(name: string) : Promise<null> {
return await TAURI_INVOKE("plugin:midi|close_input", { name });
},
async openOutput(name: string) : Promise<null> {
return await TAURI_INVOKE("plugin:midi|open_output", { name });
},
async closeOutput(name: string) : Promise<null> {
return await TAURI_INVOKE("plugin:midi|close_output", { name });
},
async outputSend(name: string, msg: number[]) : Promise<null> {
return await TAURI_INVOKE("plugin:midi|output_send", { name, msg });
}
}

export const events = __makeEvents__<{
stateChange: StateChange,
midiMessage: MIDIMessage
}>({
stateChange: "plugin:midi:state-change",
midiMessage: "plugin:midi:midi-message"
})

/** user-defined types **/

export type MIDIMessage = [string, number[]]
export type StateChange = { inputs: string[]; outputs: string[] }

/** tauri-specta globals **/

         import { invoke as TAURI_INVOKE } from "@tauri-apps/api";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindowHandle as __WebviewWindowHandle__ } from "@tauri-apps/api/window";

type __EventObj__<T> = {
  listen: (
    cb: TAURI_API_EVENT.EventCallback<T>
  ) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
  once: (
    cb: TAURI_API_EVENT.EventCallback<T>
  ) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
  emit: T extends null
    ? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
    : (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

type __Result__<T, E> =
  | { status: "ok"; data: T }
  | { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
  mappings: Record<keyof T, string>
) {
  return new Proxy(
    {} as unknown as {
      [K in keyof T]: __EventObj__<T[K]> & {
        (handle: __WebviewWindowHandle__): __EventObj__<T[K]>;
      };
    },
    {
      get: (_, event) => {
        const name = mappings[event as keyof T];

        return new Proxy((() => {}) as any, {
          apply: (_, __, [window]: [__WebviewWindowHandle__]) => ({
            listen: (arg: any) => window.listen(name, arg),
            once: (arg: any) => window.once(name, arg),
            emit: (arg: any) => window.emit(name, arg),
          }),
          get: (_, command: keyof __EventObj__<any>) => {
            switch (command) {
              case "listen":
                return (arg: any) => TAURI_API_EVENT.listen(name, arg);
              case "once":
                return (arg: any) => TAURI_API_EVENT.once(name, arg);
              case "emit":
                return (arg: any) => TAURI_API_EVENT.emit(name, arg);
            }
          },
        });
      },
    }
  );
}

     
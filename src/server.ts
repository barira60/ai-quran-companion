import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const fetch = createStartHandler(defaultStreamHandler);

export function createServerEntry(entry: any) {
  return {
    async fetch(...args: any[]) {
      return await entry.fetch(...args);
    },
  };
}

export default createServerEntry({ fetch });



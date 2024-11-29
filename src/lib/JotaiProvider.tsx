import { Provider } from "jotai";
import * as React from "react";

export const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

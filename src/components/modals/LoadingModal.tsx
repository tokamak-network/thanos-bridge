"use client";
import React from "react";
import {
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogBackdrop } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { jotaiGlobalLoading } from "@/jotai/loading";
import { useAtom } from "jotai";
export const LoadingModalComponent: React.FC = () => {
  const [globalLoading] = useAtom(jotaiGlobalLoading);
  return (
    <DialogRoot open={globalLoading} placement={"center"}>
      <DialogBackdrop />
      <DialogTrigger />
      <DialogContent bgColor={"transparent"}>
        <DialogBody display={"flex"} justifyContent={"center"}>
          <Spinner
            width={"200px"}
            height={"200px"}
            borderWidth={"10px"}
            color={"#0070ED"}
            css={{ "--spinner-track-color": "#25282F" }}
            animationDuration={"1s"}
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

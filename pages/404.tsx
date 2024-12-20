import React from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/");
  });

  return null;
}

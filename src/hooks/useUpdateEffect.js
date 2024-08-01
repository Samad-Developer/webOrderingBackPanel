import React, { useEffect, useRef } from "react";

const useUpdateEffect = (callback, dep) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current === true) {
      callback();
    }
    mounted.current = true;
  }, [dep]);

  return;
};

export default useUpdateEffect;

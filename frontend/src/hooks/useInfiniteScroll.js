import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (fetchMore, hasMore, threshold = 100) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsFetching(true);
            fetchMore().finally(() => setIsFetching(false));
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore, fetchMore]
  );

  return [isFetching, lastElementRef];
};

export default useInfiniteScroll;

import { useEffect, useRef, useState } from 'react';

interface ScrollOptions {
  offset?: number;
}

const useScrollToBottom = (
  callback: () => void,
  options: ScrollOptions = {},
) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { offset = 0 } = options;

  useEffect(() => {
    const handleScroll = () => {
      const element = scrollRef.current ?? document.documentElement;
      const scrollTop = scrollRef.current ? element.scrollTop : window.scrollY;
      const scrollHeight = scrollRef.current
        ? element.scrollHeight
        : document.documentElement.scrollHeight;
      const clientHeight = scrollRef.current
        ? element.clientHeight
        : window.innerHeight;

      const hasReachedBottom =
        scrollHeight - (scrollTop + clientHeight) <= offset;

      if (!hasReachedBottom) {
        setIsAtBottom(false);
        return;
      }

      setIsAtBottom(true);
      callback();
    };

    const target = scrollRef.current ?? window;
    target.addEventListener('scroll', handleScroll);

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [callback, offset]);

  return { isAtBottom, scrollRef };
};

export default useScrollToBottom;

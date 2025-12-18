import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background  fixed top-0 left-0 w-full h-full z-50">
      <Image
        className="w-40 h-40 transform-center animate-pulse"
        src="/svgs/nhat-cap-dang-text.svg"
        alt="Nhat Cap Dang"
        width="0"
        height="0"
        sizes="(max-width: 768px) 36px, 124px"
        loading="lazy"
        unoptimized
        fetchPriority="high"
      />
    </div>
  );
}

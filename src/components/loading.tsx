import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background  fixed top-0 left-0 w-full h-full z-50">
      <Image
        className="w-40 h-40 transform-center animate-pulse"
        src="/svgs/nhat-cap-dang-text.svg"
        alt="Nhat Cap Dang"
        width={160}
        height={48}
        loading="lazy"
        unoptimized
        fetchPriority="high"
      />
    </div>
  );
}

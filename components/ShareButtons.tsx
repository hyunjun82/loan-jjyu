"use client";

import { useState } from "react";
import { Facebook, Twitter, Copy, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11.04c0 2.88 1.9 5.41 4.75 6.84l-.97 3.56c-.07.26.2.47.44.33l4.26-2.82c.49.06.99.09 1.52.09 5.52 0 10-3.58 10-8S17.52 3 12 3" />
    </svg>
  );
}

function NaverIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.27 3h-3.42l-3.6 5.4V3H5.83v18h3.42v-5.4L12.85 21h3.42l-4.2-6.3L16.27 9V3z" />
    </svg>
  );
}

const SHARE_PLATFORMS = [
  {
    name: "카카오톡",
    icon: KakaoIcon,
    color: "hover:bg-[#FEE500] hover:text-[#3C1E1E]",
    getUrl: (url: string) => `https://story.kakao.com/share?url=${encodeURIComponent(url)}`,
  },
  {
    name: "네이버",
    icon: NaverIcon,
    color: "hover:bg-[#03C75A] hover:text-white",
    getUrl: (url: string, title: string) =>
      `https://share.naver.com/web/shareView?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "페이스북",
    icon: Facebook,
    color: "hover:bg-[#1877F2] hover:text-white",
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    icon: Twitter,
    color: "hover:bg-black hover:text-white",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
] as const;

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: (typeof SHARE_PLATFORMS)[number]) => {
    const url = window.location.href;
    const shareUrl = platform.getUrl(url, title);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-400 mr-1">
        <Share2 className="inline h-3.5 w-3.5 mr-1" />공유
      </span>
      {SHARE_PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        return (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 ${platform.color}`}
            title={`${platform.name}에 공유`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
      <button
        onClick={handleCopy}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 ${
          copied
            ? "border-blue-300 bg-blue-50 text-blue-600"
            : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
        }`}
        title="URL 복사"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      {copied && <span className="text-xs text-blue-600">복사 완료!</span>}
    </div>
  );
}

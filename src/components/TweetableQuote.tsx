'use client';

export default function TweetableQuote({ quote }: { quote: string }) {
  const handleShare = () => {
    const url = window.location.href;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}&url=${encodeURIComponent(url)}&via=minamnkarious`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  return (
    <blockquote className="tweetable-quote">
      <p>{quote}</p>
      <button type="button" onClick={handleShare} className="tweetable-quote-action">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </button>
    </blockquote>
  );
}

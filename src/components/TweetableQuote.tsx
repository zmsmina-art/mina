export default function TweetableQuote({ quote }: { quote: string }) {
  return (
    <blockquote className="tweetable-quote">
      <p>{quote}</p>
    </blockquote>
  );
}

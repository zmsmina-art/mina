export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    slug: "hi-im-mina",
    title: "Hi, I\u2019m Mina.",
    excerpt:
      "From Egypt to Canada, from engineering to marketing, and everything in between \u2014 the story of how curiosity, hustle, and a refusal to cut corners led to building Olunix.",
    content: `
It's great to have you here, and I'm genuinely grateful you took a second to look around my website. I'm not entirely sure what this article section will look like down the line. Maybe it becomes a place where I share what I'm learning, maybe it turns into something completely different. But for now, I figured the best place to start is with a bit about who I am, how I got here, and why I'm writing any of this in the first place.

## Born in Egypt. Raised in Canada. Built by Curiosity.

I was born in Egypt and moved to Canada when I was eight years old. Growing up between two cultures gives you this interesting lens on the world. You learn to read rooms quickly, adapt to new environments, and communicate across different contexts. I didn't realize it at the time, but those were some of the earliest marketing skills I ever developed.

For most of my childhood, I had my heart set on engineering. I loved understanding how things worked, breaking systems down, and building them back up. That never went away. But somewhere in high school, I stumbled into something that lit me up in a completely different way: **marketing**.

Not the "post a flyer and hope for the best" kind. I'm talking about the real stuff. Understanding people, figuring out what makes them care, and then building a bridge between what someone offers and what someone needs. That clicked for me in a way that felt almost instinctive.

## Starting Small, Learning Fast

Like most people, I started with what was right in front of me. I helped friends with their projects. Then people in my close circle. Then small clients who needed someone scrappy and hungry to figure things out.

Then COVID hit.

And look, I'm not going to romanticize a global pandemic. But what I will say is this: the timing created a unique window. Everybody was buying from home. E-commerce exploded overnight, and suddenly the skills I'd been sharpening for years were in serious demand. I started working with bigger e-commerce clients, and that's where I really started to understand what scalable marketing looks like. Not just getting attention, but **converting it, retaining it, and building systems around it**.

That period taught me more than any textbook ever could.

## Engineering Meets Marketing

I went on to study Automotive Engineering Technology at McMaster University, and I know that might seem like a left turn from marketing. But to me, it was always part of the same thread. Engineering taught me how to think in systems. How to be precise. How to solve problems methodically. Marketing, on the other hand, taught me how to think about people. How to communicate. How to create value that someone actually *feels*.

The intersection of those two things is where I do my best work.

## Building Olunix

In the summer before my final year, I made a decision that changed everything. I started a company.

My CTO and CMO were with me from early on, and together we set out to do something that sounds simple but turned out to be anything but: **use marketing to create real value in the world.**

It took us a while to figure out what that actually meant. It meant saying no to shortcuts. It meant prioritizing doing things well over doing things fast. It meant hardship, real hardship, in learning to hold ourselves to a standard that most people in this space don't bother with.

But it has been worth it.

We started as GrowByte Media, working with automotive dealerships and dental offices, learning the ins and outs of industries that most marketers overlook. Over time, as our approach matured and our clients evolved, we rebranded to **Olunix** \u2014 a name that better reflects who we are today: not just a marketing agency, but a consulting and growth partner.

Today, we work predominantly with AI startups. The companies we partner with are building the future, and our job is to help them get the right message in front of the right people at the right time. It's strategic. It's technical. And it's deeply human.

## Why I\u2019m Writing This

I started this article section because I believe that the best marketers aren't just practitioners. They're thinkers. They share what they know. They contribute to the conversation. And they're honest about the journey \u2014 not just the highlight reel.

So that's what I plan to do here. Share what I'm learning, what I'm building, and what I think matters in a world where marketing is evolving faster than most people can keep up with.

If you've made it this far, thank you. Stick around \u2014 there's more to come.

*\u2014 MM*
    `,
    publishedAt: "2026-02-05",
    updatedAt: "2026-02-05",
    readingTime: "5 min read",
    tags: ["Personal", "Entrepreneurship", "Marketing"],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getLatestArticles(count: number): Article[] {
  return [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, count);
}

export function getAllArticlesSorted(): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

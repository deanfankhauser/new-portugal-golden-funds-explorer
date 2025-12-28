import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Rss, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { useFundNews, NewsArticle } from '@/hooks/useFundNews';
import { formatDistanceToNow } from 'date-fns';

interface FundNewsSectionProps {
  rssFeedUrl?: string | null;
}

function formatPublishDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Recently';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Recently';
  }
}

function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all duration-200">
        {article.imageUrl && (
          <div className="hidden sm:block flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-muted">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {article.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {article.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatPublishDate(article.pubDate)}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </a>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 rounded-lg border border-border">
          <Skeleton className="hidden sm:block w-24 h-24 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FundNewsSection({ rssFeedUrl }: FundNewsSectionProps) {
  const { data, isLoading, isError, error } = useFundNews(rssFeedUrl);

  // Don't render anything if no RSS feed URL is provided
  if (!rssFeedUrl) {
    return null;
  }

  return (
    <section id="fund-news" className="scroll-mt-28 md:scroll-mt-24">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Rss className="h-5 w-5 text-primary" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton />}
          
          {isError && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 text-muted-foreground">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Unable to load news feed. Please try again later.
              </p>
            </div>
          )}
          
          {data && !data.success && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 text-muted-foreground">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                Unable to load news feed at this time.
              </p>
            </div>
          )}
          
          {data?.success && data.articles.length === 0 && (
            <div className="text-center p-6 text-muted-foreground">
              <Rss className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No news articles available.</p>
            </div>
          )}
          
          {data?.success && data.articles.length > 0 && (
            <div className="space-y-3">
              {data.articles.slice(0, 5).map((article, index) => (
                <NewsArticleCard key={`${article.link}-${index}`} article={article} />
              ))}
              
              {data.articles.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={rssFeedUrl} target="_blank" rel="noopener noreferrer">
                      View all news
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default FundNewsSection;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube } from 'lucide-react';

interface FundVideoSectionProps {
  videoUrl?: string;
}

// Extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const FundVideoSection: React.FC<FundVideoSectionProps> = ({ videoUrl }) => {
  if (!videoUrl) {
    return null;
  }

  const videoId = getYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    return null;
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          Featured Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="Fund video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FundVideoSection;

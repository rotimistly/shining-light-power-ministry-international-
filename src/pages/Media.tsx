import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Video, FileText, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["All", "Worship", "Events", "Sermons", "Community", "Other"];

export default function Media() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const { data: media, isLoading } = useQuery({
    queryKey: ["media", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("media")
        .select("*")
        .order("date_uploaded", { ascending: false });

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "text":
        return FileText;
      default:
        return ImageIcon;
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Media <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our collection of photos, videos, and inspirational content
            from our ministry activities.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="animate-pulse aspect-square">
                  <div className="h-full bg-muted rounded-lg" />
                </Card>
              ))}
            </div>
          ) : media && media.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {media.map((item) => {
                const Icon = getMediaIcon(item.media_type);
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 group"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <div className="aspect-square relative bg-muted">
                      {item.media_type === "image" && item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : item.media_type === "video" ? (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <Video className="w-16 h-16 text-primary" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent">
                          <FileText className="w-16 h-16 text-primary" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium text-primary-foreground bg-primary/80 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground capitalize">
                            {item.media_type}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.date_uploaded), "MMM d, yyyy")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                No Media Yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There is no media content in{" "}
                {selectedCategory === "All"
                  ? "the gallery"
                  : `the ${selectedCategory} category`}{" "}
                at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Media Detail Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedMedia?.category}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedMedia?.media_type === "image" && selectedMedia?.image_url && (
              <img
                src={selectedMedia.image_url}
                alt={selectedMedia.category}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
            {selectedMedia?.media_type === "video" && selectedMedia?.video_url && (
              <div className="aspect-video">
                <iframe
                  src={selectedMedia.video_url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            )}
            {selectedMedia?.media_type === "text" && selectedMedia?.text_content && (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedMedia.text_content}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Uploaded on{" "}
              {selectedMedia &&
                format(new Date(selectedMedia.date_uploaded), "MMMM d, yyyy")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

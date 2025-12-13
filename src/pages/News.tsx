import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function News() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date_created", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Church <span className="text-primary">News</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest announcements, updates, and
            inspirational messages from our ministry.
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {news.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-card transition-shadow overflow-hidden"
                >
                  <div className="flex">
                    <div className="w-2 bg-primary" />
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          {format(new Date(item.date_created), "MMMM d, yyyy")}
                        </div>
                        <CardTitle className="font-display text-xl md:text-2xl">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {item.message}
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                No News Yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no news posts at the moment. Check back soon for
                updates and announcements from our ministry.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

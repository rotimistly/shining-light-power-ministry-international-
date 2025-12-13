import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true });
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
            Upcoming <span className="text-primary">Events</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for worship, fellowship, and life-changing experiences.
            Check out what's happening at Shining Light Power Ministry.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-2 bg-muted rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className={`overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                    event.is_today ? "ring-2 ring-primary shadow-glow" : ""
                  }`}
                >
                  <div className="h-2 bg-primary" />
                  <CardHeader>
                    {event.is_today && (
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Star className="w-4 h-4 fill-primary" />
                        <span className="text-xs font-bold uppercase tracking-wide">
                          Happening Today!
                        </span>
                      </div>
                    )}
                    <CardTitle className="font-display text-xl">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.description && (
                      <p className="text-muted-foreground text-sm">
                        {event.description}
                      </p>
                    )}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">
                          {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {event.event_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                No Upcoming Events
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no scheduled events at the moment. Check back soon for
                updates on our upcoming programs and activities.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

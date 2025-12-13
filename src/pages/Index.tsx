import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Newspaper, Users, ImageIcon, ArrowRight, Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import heroImage from "@/assets/hero-worship.jpg";

export default function Index() {
  const { data: upcomingEvents } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: latestNews } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date_created", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              Shining Light
              <span className="block text-primary">Power Ministry</span>
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-primary-foreground/90">
                International
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              A beacon of hope and faith, spreading God's love across nations.
              Join us in worship, fellowship, and service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/join">
                <Button variant="hero" size="xl">
                  <Users className="w-5 h-5" />
                  Join a Department
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="warm" size="xl" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20">
                  <Calendar className="w-5 h-5" />
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/30 blur-3xl rounded-full" />
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Join a Department",
                description: "Serve with your gifts and talents in our ministry departments",
                href: "/join",
                color: "text-primary",
              },
              {
                icon: Calendar,
                title: "Upcoming Events",
                description: "Stay connected with our church programs and activities",
                href: "/events",
                color: "text-primary",
              },
              {
                icon: ImageIcon,
                title: "Media Gallery",
                description: "Explore photos, videos, and inspirational content",
                href: "/media",
                color: "text-primary",
              },
            ].map((item, index) => (
              <Link key={index} to={item.href}>
                <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Join us for fellowship and worship
              </p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0">
              <Button variant="ghost" className="group">
                View All Events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className={`overflow-hidden ${event.is_today ? 'ring-2 ring-primary shadow-glow' : ''}`}>
                  <div className="h-2 bg-primary" />
                  <CardHeader>
                    {event.is_today && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full w-fit mb-2">
                        TODAY
                      </span>
                    )}
                    <CardTitle className="font-display text-xl">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      {format(new Date(event.event_date), "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.event_time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming events at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Latest News
              </h2>
              <p className="text-muted-foreground">
                Stay updated with church announcements
              </p>
            </div>
            <Link to="/news" className="mt-4 md:mt-0">
              <Button variant="ghost" className="group">
                View All News
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {latestNews && latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item) => (
                <Card key={item.id} className="hover:shadow-card transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Newspaper className="w-4 h-4 text-primary" />
                      {format(new Date(item.date_created), "MMMM d, yyyy")}
                    </div>
                    <CardTitle className="font-display text-xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {item.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No news at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Ready to Serve?
          </h2>
          <p className="text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
            Use your God-given gifts to make a difference. Join one of our
            ministry departments and be part of something greater.
          </p>
          <Link to="/join">
            <Button variant="hero" size="xl">
              Join a Department Today
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

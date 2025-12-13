import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Eye, Users, BookOpen, Globe } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About Our <span className="text-primary">Ministry</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Shining Light Power Ministry International is a vibrant community of
            believers committed to spreading the gospel and transforming lives
            through the power of God's love.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Our Story
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                Founded on the principles of faith, hope, and love, Shining Light
                Power Ministry International has been a beacon of spiritual
                guidance for believers around the world. Our ministry began with
                a simple vision: to be a light in the darkness and to share the
                transformative power of God's grace with everyone we encounter.
              </p>
              <p>
                Over the years, we have grown into a global community, united by
                our shared faith and commitment to serving others. Through
                worship, teaching, outreach, and fellowship, we continue to
                fulfill our calling to shine God's light in every corner of the
                world.
              </p>
              <p>
                Today, our church stands as a testament to God's faithfulness and
                the power of a community united in purpose. We welcome all who
                seek to grow in their faith, find community, and discover their
                God-given purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be a global ministry that illuminates the world with God's
                  love, empowering believers to live purposeful lives and impact
                  their communities for Christ. We envision a world where every
                  person has encountered the transformative power of the gospel.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To spread the light of God's love through passionate worship,
                  sound biblical teaching, genuine fellowship, and compassionate
                  outreach. We are committed to making disciples, building strong
                  families, and serving our communities with excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do as a ministry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Love",
                description:
                  "We are driven by God's unconditional love for all people and strive to reflect that love in all we do.",
              },
              {
                icon: BookOpen,
                title: "Truth",
                description:
                  "We are committed to teaching and living according to the unchanging truth of God's Word.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "We believe in the power of authentic relationships and intentional fellowship.",
              },
              {
                icon: Globe,
                title: "Global Impact",
                description:
                  "We are called to reach beyond our walls and make disciples of all nations.",
              },
              {
                icon: Target,
                title: "Excellence",
                description:
                  "We honor God by giving our best in worship, service, and ministry.",
              },
              {
                icon: Eye,
                title: "Integrity",
                description:
                  "We are committed to transparency, accountability, and living lives of moral excellence.",
              },
            ].map((value, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

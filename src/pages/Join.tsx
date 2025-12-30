import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Music, Camera, Mic, Wrench, Heart, CheckCircle } from "lucide-react";
import { z } from "zod";

const departments = [
  { id: "ushering", name: "Ushering", icon: Users, description: "Welcome and assist congregation" },
  { id: "media", name: "Media Department", icon: Camera, description: "Handle audio, video, and live streaming" },
  { id: "choir", name: "Choir", icon: Music, description: "Lead worship through singing" },
  { id: "instrumentalists", name: "Instrumentalists", icon: Mic, description: "Play musical instruments" },
  { id: "technical", name: "Technical Department", icon: Wrench, description: "Manage sound and lighting systems" },
];

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  gender: z.string().min(1, "Please select a gender"),
  age: z.string().optional(),
  departments: z.array(z.string()).min(1, "Please select at least one department"),
  experience: z.string().max(1000).optional(),
});

export default function Join() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    departments: [] as string[],
    experience: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDepartmentToggle = (deptId: string) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.includes(deptId)
        ? prev.departments.filter((d) => d !== deptId)
        : [...prev.departments, deptId],
    }));
    setErrors((prev) => ({ ...prev, departments: "" }));
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("worker_applications").insert({
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone.trim(),
        gender: formData.gender,
        age: formData.age ? parseInt(formData.age) : null,
        departments: formData.departments,
        previous_experience: formData.experience.trim() || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in serving. We'll be in touch soon.",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-16 md:py-32">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center border-0 shadow-card">
              <CardContent className="py-16">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">
                  Application Received!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Thank you for your desire to serve in our ministry. A member of
                  our team will review your application and contact you soon.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Submit Another Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join Our <span className="text-primary">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Use your God-given gifts to serve in our ministry. We have various
            departments where you can make a difference.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto border-0 shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-2xl">
                Worker Application Form
              </CardTitle>
              <CardDescription>
                Fill out the form below to apply to join a department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-sm text-destructive">{errors.gender}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (Optional)</Label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        placeholder="Enter your age"
                      />
                    </div>
                  </div>
                </div>

                {/* Departments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    Select Department(s) *
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose one or more departments you'd like to serve in
                  </p>
                  {errors.departments && (
                    <p className="text-sm text-destructive">{errors.departments}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departments.map((dept) => {
                      const Icon = dept.icon;
                      const isSelected = formData.departments.includes(dept.id);
                      return (
                        <div
                          key={dept.id}
                          onClick={() => handleDepartmentToggle(dept.id)}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={() => handleDepartmentToggle(dept.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="font-medium">{dept.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {dept.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Previous Experience (Optional)</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="Tell us about any relevant experience you have in the selected department(s)..."
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

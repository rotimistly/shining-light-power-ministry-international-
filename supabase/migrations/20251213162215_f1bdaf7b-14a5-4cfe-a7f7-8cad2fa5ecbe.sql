-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create worker_applications table
CREATE TABLE public.worker_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INTEGER,
  departments TEXT[] NOT NULL,
  previous_experience TEXT,
  date_submitted TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  is_today BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create news table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create media table
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'text')),
  image_url TEXT,
  video_url TEXT,
  text_content TEXT,
  category TEXT NOT NULL,
  date_uploaded TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Create has_role function for checking admin status
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
ON public.user_roles FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Worker applications policies (public can insert, admins can view all)
CREATE POLICY "Anyone can submit worker application" 
ON public.worker_applications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all applications" 
ON public.worker_applications FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications" 
ON public.worker_applications FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Events policies (public can view, admins can manage)
CREATE POLICY "Anyone can view events" 
ON public.events FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage events" 
ON public.events FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- News policies (public can view, admins can manage)
CREATE POLICY "Anyone can view news" 
ON public.news FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage news" 
ON public.news FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Media policies (public can view, admins can manage)
CREATE POLICY "Anyone can view media" 
ON public.media FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage media" 
ON public.media FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update is_today flag
CREATE OR REPLACE FUNCTION public.update_events_is_today()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET is_today = (event_date = CURRENT_DATE);
END;
$$;

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies for media bucket
CREATE POLICY "Anyone can view media files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Image, Video, FileText, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CATEGORIES = ["Worship", "Events", "Community", "Sermons", "Announcements"];
const MEDIA_TYPES = ["Image", "Video", "Text"];

interface MediaFormData {
  media_type: string;
  category: string;
  text_content: string;
  video_url: string;
}

const initialFormData: MediaFormData = {
  media_type: "Image",
  category: "",
  text_content: "",
  video_url: "",
};

const MediaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MediaFormData>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: media, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("date_uploaded", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { media_type: string; category: string; text_content?: string; video_url?: string; image_url?: string }) => {
      const { error } = await supabase.from("media").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast({ title: "Media uploaded successfully" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Failed to upload media", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const item = media?.find((m) => m.id === id);
      if (item?.image_url) {
        const path = item.image_url.split("/").slice(-2).join("/");
        await supabase.storage.from("media").remove([path]);
      }
      const { error } = await supabase.from("media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast({ title: "Media deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete media", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setFormData(initialFormData);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let image_url: string | undefined;

      if (formData.media_type === "Image" && selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        console.log("Uploading file:", filePath, "Size:", selectedFile.size);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        console.log("Upload successful:", uploadData);
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
        image_url = urlData.publicUrl;
        console.log("Public URL:", image_url);
      }

      await createMutation.mutateAsync({
        media_type: formData.media_type,
        category: formData.category,
        text_content: formData.media_type === "Text" ? formData.text_content : undefined,
        video_url: formData.media_type === "Video" ? formData.video_url : undefined,
        image_url,
      });
    } catch (error: any) {
      console.error("Full error:", error);
      toast({ 
        title: "Failed to upload media", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "Image":
        return <Image className="h-5 w-5" />;
      case "Video":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl text-secondary">Media Gallery</h2>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Media
        </Button>
      </div>

      {media?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No media uploaded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media?.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.media_type === "Image" && item.image_url && (
                <div className="aspect-video bg-muted">
                  <img
                    src={item.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {item.media_type === "Video" && (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {item.media_type === "Text" && (
                <div className="aspect-video bg-muted p-4 overflow-hidden">
                  <p className="text-sm line-clamp-6">{item.text_content}</p>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getMediaIcon(item.media_type)}
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.date_uploaded), "PPP")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media_type">Media Type</Label>
              <Select
                value={formData.media_type}
                onValueChange={(value) => setFormData({ ...formData, media_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.media_type === "Image" && (
              <div className="space-y-2">
                <Label>Image File</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : "Choose Image"}
                </Button>
              </div>
            )}

            {formData.media_type === "Video" && (
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                />
              </div>
            )}

            {formData.media_type === "Text" && (
              <div className="space-y-2">
                <Label htmlFor="text_content">Content</Label>
                <Textarea
                  id="text_content"
                  value={formData.text_content}
                  onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                  rows={6}
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !formData.category}>
                {isUploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Upload
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The media will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaManager;

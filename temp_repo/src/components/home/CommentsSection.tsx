import React, { useState, useEffect } from "react";
import { addComment, getCommentsBySignalAccount } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface CommentsSectionProps {
  comments?: Comment[];
  onAddComment?: (content: string) => void;
}

const CommentsSection = ({
  comments = [
    {
      id: "1",
      username: "TraderJoe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderJoe",
      content:
        "Great platform! I've been using it for a month and already seeing results.",
      timestamp: "2023-10-15T14:30:00Z",
    },
    {
      id: "2",
      username: "ForexMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ForexMaster",
      content:
        "The signal providers here are top-notch. Much better than other platforms I've tried.",
      timestamp: "2023-10-14T09:15:00Z",
    },
    {
      id: "3",
      username: "PipHunter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PipHunter",
      content:
        "Just started my free trial with AggressiveScalper. The copy settings are really flexible!",
      timestamp: "2023-10-13T18:45:00Z",
    },
  ],
  onAddComment = () => {},
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Add comment to Supabase
      const { success, comment } = await addComment(null, newComment);
      if (success && comment) {
        // Create a new comment object with the returned data
        const newCommentObj: Comment = {
          id: comment.id,
          username: comment.users?.full_name || "Anonymous",
          avatar:
            comment.users?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`,
          content: comment.content,
          timestamp: comment.created_at,
        };

        onAddComment(newComment);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full bg-black text-white p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">Community Comments</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          placeholder="Share your thoughts with the community..."
          className="min-h-[100px] bg-gray-900 border-gray-700 text-white mb-3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                  <AvatarFallback>
                    {comment.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-white">
                    {comment.username}
                  </CardTitle>
                  <p className="text-xs text-gray-400">
                    {formatDate(comment.timestamp)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">{comment.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Reply
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;

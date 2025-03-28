import React, { useState, useEffect } from "react";
import { addComment, getCommentsBySignalAccount } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface ProviderCommentsProps {
  providerId?: string;
  comments?: Comment[];
  onAddComment?: (comment: string) => void;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

const commentFormSchema = z.object({
  comment: z
    .string()
    .min(3, {
      message: "Comment must be at least 3 characters.",
    })
    .max(500, {
      message: "Comment cannot be longer than 500 characters.",
    }),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

const ProviderComments: React.FC<ProviderCommentsProps> = ({
  providerId = "1",
  comments = defaultComments,
  onAddComment = () => {},
}) => {
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  useEffect(() => {
    // Fetch comments for this provider
    const fetchComments = async () => {
      try {
        const { success, comments } =
          await getCommentsBySignalAccount(providerId);
        if (success && comments) {
          // Map the comments to the expected format
          const formattedComments: Comment[] = comments.map((comment) => ({
            id: comment.id,
            userId: comment.user_id,
            userName: comment.users?.full_name || "Anonymous",
            userAvatar: comment.users?.avatar_url,
            content: comment.content,
            createdAt: new Date(comment.created_at),
          }));

          setLocalComments(formattedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [providerId]);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values: CommentFormValues) => {
    try {
      // Add comment to Supabase
      const { success, comment } = await addComment(providerId, values.comment);

      if (success && comment) {
        // Create a new comment object with the returned data
        const newComment: Comment = {
          id: comment.id,
          userId: comment.user_id,
          userName: comment.users?.full_name || "Anonymous",
          userAvatar: comment.users?.avatar_url,
          content: comment.content,
          createdAt: new Date(comment.created_at),
        };

        setLocalComments([newComment, ...localComments]);
        onAddComment(values.comment);
        form.reset();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full bg-black text-white p-6 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=current"
                        alt="Current User"
                      />
                      <AvatarFallback>CU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex">
                      <Textarea
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-900 border-gray-700"
                        {...field}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="ml-2 self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="space-y-6 mt-6">
        {localComments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          localComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userAvatar || comment.userName}`}
                  alt={comment.userName}
                />
                <AvatarFallback>
                  {comment.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{comment.userName}</h3>
                  <span className="text-xs text-gray-400">
                    {format(comment.createdAt, "MMM d, yyyy")}
                  </span>
                </div>
                <p className="mt-1 text-gray-200">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Default comments for demonstration
const defaultComments: Comment[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alex Trader",
    userAvatar: "alex",
    content:
      "Great signals! I've been following for 3 months and my account is up 45%. Highly recommended for EUR/USD pairs.",
    createdAt: new Date("2023-10-15"),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah FX",
    userAvatar: "sarah",
    content:
      "The risk management is excellent. I appreciate how you set clear stop losses on every trade.",
    createdAt: new Date("2023-10-10"),
  },
  {
    id: "3",
    userId: "user3",
    userName: "TradeMaster",
    userAvatar: "master",
    content:
      "How do you handle news events? Do you close positions before major announcements?",
    createdAt: new Date("2023-10-05"),
  },
];

export default ProviderComments;

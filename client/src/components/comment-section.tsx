import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Reply, SendHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { insertCommentSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";

interface CommentSectionProps {
  signalAccountId?: number;
  isGeneral: boolean;
}

export function CommentSection({ signalAccountId, isGeneral }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyTo, setReplyTo] = useState<number | null>(null);

  // Define form schema for comment submission
  const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
  });

  // Set up the form
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: [
      isGeneral ? "/api/comments/general" : `/api/signal-accounts/${signalAccountId}/comments`,
    ],
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (data: { content: string; parentId?: number }) => {
      const payload = {
        content: data.content,
        isGeneral,
        signalAccountId: isGeneral ? null : signalAccountId,
        parentId: data.parentId || null,
      };
      const res = await apiRequest("POST", "/api/comments", payload);
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      setReplyTo(null);
      queryClient.invalidateQueries({
        queryKey: [
          isGeneral
            ? "/api/comments/general"
            : `/api/signal-accounts/${signalAccountId}/comments`,
        ],
      });
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to post comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await apiRequest("POST", `/api/comments/${commentId}/like`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          isGeneral
            ? "/api/comments/general"
            : `/api/signal-accounts/${signalAccountId}/comments`,
        ],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to like comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    commentMutation.mutate({
      content: values.content,
      parentId: replyTo,
    });
  };

  // Handle like button click
  const handleLike = (commentId: number) => {
    likeMutation.mutate(commentId);
  };

  // Handle reply button click
  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    // Focus on the textarea
    setTimeout(() => {
      const textarea = document.getElementById("comment-textarea");
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyTo(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Comment form */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {replyTo !== null && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">
                        Replying to a comment
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={cancelReply}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            id="comment-textarea"
                            placeholder="Share your thoughts with the community..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      className="flex items-center"
                      disabled={commentMutation.isPending}
                    >
                      {commentMutation.isPending ? (
                        "Posting..."
                      ) : (
                        <>
                          <SendHorizontal className="mr-2 h-4 w-4" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {comment.user?.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm">{comment.user?.displayName}</span>
                        <span className="text-muted-foreground text-xs ml-2">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </CardContent>
                  </Card>
                  <div className="flex items-center mt-1 text-xs space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleLike(comment.id)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleReply(comment.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-10 space-y-4">
                  {comment.replies.map((reply: any) => (
                    <div key={reply.id} className="flex space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                          {reply.user?.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="p-2">
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-xs">{reply.user?.displayName}</span>
                              <span className="text-muted-foreground text-xs ml-2">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs">{reply.content}</p>
                          </CardContent>
                        </Card>
                        <div className="flex items-center mt-1 text-xs space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-muted-foreground hover:text-foreground text-xs"
                            onClick={() => handleLike(reply.id)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{reply.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}

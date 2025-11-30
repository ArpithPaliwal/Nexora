
import { useCommentReplies } from "../../Features/Comments/useCommentReplies";
import CommentItem from "./Comment";


export default function ReplyList({ parentCommentId }) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useCommentReplies(parentCommentId);

  if (isLoading) return <p className="ml-10">Loading replies...</p>;

  return (
    <div className="  md:ml-10 mt-2 border-l  p-1 md:pl-4">
      
      {data?.pages?.flatMap((page) =>
        page?.docs).map((reply) => (
          <CommentItem key={reply?._id} comment={reply} />
        ))
      }

      {hasNextPage && (
        <button
          className="text-blue-600 text-sm mt-2"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load more replies"}
        </button>
      )}
    </div>
  );
}


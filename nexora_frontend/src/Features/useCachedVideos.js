import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function useCachedVideo(_id) {
  const client = useQueryClient();

  return useMemo(() => {
    // Get cache for infinite videos
   const allQueries = client.getQueryCache().getAll();
  const videoQueries = allQueries.filter(
    (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "videos"
  );
  let docs;
  videoQueries.forEach((q) => {
    const pages = q.state.data?.pages || [];
    docs = pages?.flatMap((p) => p.data.docs);
  });
  let video = docs?.find((v) => v._id === _id);
  return video
},[client,_id])
}
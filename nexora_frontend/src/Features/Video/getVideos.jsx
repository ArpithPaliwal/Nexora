import { useInfiniteQuery, useQueryClient,useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchVideos,fetchVideoById, fetchSubscribedVideos } from "../../API/videoApi";

function getVideos(query, sortBy, sortType) {
 
  
  return useInfiniteQuery({
    queryKey: ["videos",query,sortBy,sortType],
    queryFn: ({ pageParam }) => fetchVideos(pageParam,query,sortBy,sortType),
    getNextPageParam: (lastPage) => lastPage.data.nextPage ?? undefined,

    
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 10
    
  });
}


function getVideoById(_id,enabled)
{ 
   
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData(["video", _id]);

  return useQuery({
    queryKey:["video",_id],
    queryFn: ({ queryKey }) => {;
      if (cached) {
        
        
        return cached; 
      }else{ return fetchVideoById(queryKey[1])}},
      
    enabled:enabled,
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 10,
    
  })
}


function getSubscribedVideos() {
  
  
  return useInfiniteQuery({
    queryKey: ["videos","subscribed"],
    queryFn: ({ pageParam }) => fetchSubscribedVideos(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      
      return lastPage.data.length === 10 ? allPages.data.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 10
    
  });
}
export  {getVideos,getVideoById,getSubscribedVideos};

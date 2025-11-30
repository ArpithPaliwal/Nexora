import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TweetCard from '../Tweets/TweetCard';
import { DeleteTweet } from '../../API/TweetApi';
import { useInView } from 'react-intersection-observer';

function Tweets({ query, isOwner, userId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = query;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {isOwner && (
        <div className="flex justify-end">
          <button
            className="bg-[#0175FE] mx-5 text-white rounded-2xl p-2 cursor-pointer"
            onClick={() => navigate(`/Tweets/createTweet/${userId}`)}
          >
            Create Tweet
          </button>
        </div>
      )}

      <div className="flex flex-col justify-center items-center gap-5">
        {data?.pages
          ?.flatMap((page) => page?.data?.docs)
          .map((tweet) => (
            <div
              className="flex flex-col bg-accent rounded-2xl w-fit"
              key={tweet._id}
            >
              <TweetCard key={tweet._id} tweet={tweet} />
              

              {isOwner && (
                <div className="text-sm p-3 flex justify-center gap-10">
                  <button
                    className="bg-[#0175FE] text-white rounded-2xl p-2 px-10 cursor-pointer"
                    onClick={() =>
                      navigate(`/Tweets/EditTweet/${userId}/${tweet._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white rounded-2xl p-2 px-10 cursor-pointer"
                    onClick={async () => {
                      await DeleteTweet(tweet?._id);
                      await queryClient.invalidateQueries({
                        queryKey: ["Tweets", userId],
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div
          ref={ref}
          className="w-full h-10 flex justify-center items-center mt-4"
        >
          {isFetchingNextPage ? "Loading..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}

export default Tweets;

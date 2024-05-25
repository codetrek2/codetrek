import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import "./CommentSection.css";
import Messages from "../Comments/CommentEditor";
import CommentRating from './CommentRating';
import RepliesSection from './RepliesSection';

const MemoizedRepliesSection = React.memo(RepliesSection);

const CommentSection = ({ ticketId, onExpandClick }) => {
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMessages, setActiveMessages] = useState({});
  const [cachedUserData, setCachedUserData] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const toggleShowReplies = (commentId) => {
    setShowReplies((prevShowReplies) => ({
      ...prevShowReplies,
      [commentId]: !prevShowReplies[commentId],
    }));
  };

  const fetchData = async () => {
    const fetchedComments = await fetchComments(ticketId);

    const commentsWithReplies = await Promise.all(
      fetchedComments.map(async (comment) => {
        const replies = await fetchReplies(comment.id);
        const repliesUserData = await Promise.all(replies.map((reply) => fetchUserData(reply.uid)));
        const repliesUsersMap = replies.reduce((acc, reply, index) => {
          acc[reply.uid] = repliesUserData[index];
          return acc;
        }, {});

        setCommentUsers((prevCommentUsers) => ({
          ...prevCommentUsers,
          ...repliesUsersMap,
        }));

        return {
          ...comment,
          replies,
        };
      })
    );

    const usersData = await Promise.all(fetchedComments.map((comment) => fetchUserData(comment.uid)));
    const usersMap = fetchedComments.reduce((acc, comment, index) => {
      acc[comment.uid] = usersData[index];
      return acc;
    }, {});

    setCommentUsers((prevCommentUsers) => ({
      ...prevCommentUsers,
      ...usersMap,
    }));
    setComments(commentsWithReplies);
    setLoading(false);
  };
  const handleCommentAdded = () => {
    fetchData();
  };

  const handleToggleMessages = (commentId) => {
    setActiveMessages((prevActiveMessages) => ({
      ...prevActiveMessages,
      [commentId]: !prevActiveMessages[commentId]
    }));
  };

  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [ticketId]);

  const fetchComments = async (ticketId) => {
    const db = getFirestore();
    const commentCollection = collection(db, 'comment');
    const ticketQuery = query(commentCollection, where('ticketId', '==', ticketId));
    const querySnapshot = await getDocs(ticketQuery);
    const fetchedComments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      replies: [],
      likeCount: doc.data().likeCount || 0,
    }));

    return fetchedComments;
  };

  const fetchReplies = async (commentId) => {
    const db = getFirestore();
    const subcommentsQuery = query(collection(db, 'comment', commentId, 'replies'));
    const subcommentsSnapshot = await getDocs(subcommentsQuery);
    const subcommentsData = subcommentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return subcommentsData;
  };



  const fetchUserData = async (uid) => {
    if (cachedUserData[uid]) {
      return cachedUserData[uid];
    }

    const db = getFirestore();
    const userDocRef = doc(db, 'users', uid);
    const userDocSnapshot = await getDoc(userDocRef);

    const userData = userDocSnapshot.exists() ? userDocSnapshot.data() : null;
    setCachedUserData((prevCachedUserData) => ({
      ...prevCachedUserData,
      [uid]: userData,
    }));

    return userData;
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (comments.length === 0) {
    return <p>Vacío</p>;
  }

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="container row comment-container" >
          <div className="row-comment">

            <div className="content" style={{ flex: 0 }}>
              <div className="meta">
                <p id="username">
                  {commentUsers[comment.uid]?.username || "Desconocido"}
                </p>
                <p id="user-title">
                  {commentUsers[comment.uid]?.profession || "Desconocido"}
                </p>

              </div>
            </div>

            <div className="content">
              <div className="meta">
                <div className="fecha">
                  {comment.createdAt?.toDate().toLocaleString()}
                </div>
              </div>

              <div className="post-text">
                {comment.text ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                  />
                ) : (
                  "..."
                )}
              </div>

              <div className="reply-container">
                <button
                  className="reply-btn expand-code"
                  onClick={() => toggleShowReplies(comment.id)}
                >
                  <span className="btn-text">
                    {`${comment.replies.length}`}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                    </svg>

                  </span>
                </button>
                <CommentRating commentId={comment.id} likeCount={comment.likeCount} />
                <button
                  className="reply-btn expand-code"
                  onClick={() => handleToggleMessages(comment.id)}
                >
                  <span className="btn-text">Comentar</span>
                </button>
                <button
                  onClick={() => onExpandClick(comment)}
                  className="expand-code" > Ver código <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                    <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                  </svg>
                </button>

              </div>
            </div>
          </div>
          {activeMessages[comment.id] && (
            <Messages
              codeContent={`// ${comment.code}`}
              codeLanguage={comment.language}
              ticketId={comment.id}
              commentType="subcomment"
              onCommentAdded={handleCommentAdded}
            />
          )}


          {showReplies[comment.id] && (
            <MemoizedRepliesSection replies={comment.replies} commentUsers={commentUsers} />
          )}


        </div>
      ))}
    </>
  );
};

export default CommentSection;

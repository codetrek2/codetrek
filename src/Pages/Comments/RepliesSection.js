import React from 'react';

const RepliesSection = ({ replies, commentUsers }) => {



    return (
        <>

            <div className="replies-container">
                {replies.map((subcomment) => (
                    <div key={subcomment.id} className="container row comment-container subcomment">
                        <div className="row">
                            <div className="content" style={{ flex: 0 }}>
                                <div className="meta">
                                    <p id="username">{commentUsers[subcomment.uid]?.username || 'Desconocido'}</p>
                                    <p id="user-title">{commentUsers[subcomment.uid]?.profession || 'Desconocido'}</p>
                                </div>
                            </div>

                            <div className="content">
                                <div className="meta" style={{ paddingTop: "2.5vw", paddingBottom: ".5vw" }} >
                                    <div className="fecha">{subcomment.createdAt?.toDate().toLocaleString()}</div>

                                    <div className="post-text">
                                        {subcomment.text ? (
                                            <div dangerouslySetInnerHTML={{ __html: subcomment.text }} />
                                        ) : (
                                            '...'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </>
    );
};

export default RepliesSection;

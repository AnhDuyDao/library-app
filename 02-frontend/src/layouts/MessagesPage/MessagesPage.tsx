import { useState } from "react";
import { PostNewMassage } from "./components/PostNewMassage";
import { Messages } from "./components/Messages";

export const MessagesPage = () => {

    const [messagesClick, setMessagesClick] = useState(false);


    return (
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={() => setMessagesClick(false)} className="nav-link active"
                            id="nav-send-message-tab" data-bs-toggle="tab" data-bs-target="#nav-send-message"
                            type="button" role="tab" aria-controls="nav-send-message" aria-selected="true">
                            Submit Question
                        </button>
                        <button onClick={() => setMessagesClick(true)} className="nav-link"
                            id="nav-messages-tab" data-bs-toggle="tab" data-bs-target="#nav-message"
                            type="button" role="tab" aria-controls="nav-messages" aria-selected="false">
                            Q/A Response/Pending
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-send-message" role="tabpanel"
                        aria-labelledby="nav-send-message-tab">
                        <PostNewMassage />
                    </div>
                    <div className="tab-pane fade" id="nav-message" role="tabpanel" aria-labelledby="nav-messages-tab">
                        {messagesClick ? <Messages /> : <></>}
                    </div>

                </div>
            </div>
        </div>
    );
}
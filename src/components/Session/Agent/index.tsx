import React, { memo, useEffect, useState, useRef } from "react";
import { useParticipantIds, useVideoTrack } from "@daily-co/daily-react";
// useActiveSpeakerId,
import clsx from "clsx";
import { Loader2 } from "lucide-react";

import Latency from "@/components/Latency";
// import Transcript from "@/components/Transcript";

import styles from "./styles.module.css";

type AgentState = "connecting" | "loading" | "connected";

export const Agent: React.FC<{
  hasStarted: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ hasStarted = false, statsAggregator }) => {
    const participantIds = useParticipantIds({ filter: "remote" });
    // const activeSpeakerId = useActiveSpeakerId({ ignoreLocal: true });
    const [agentState, setAgentState] = useState<AgentState>("connecting");

    const chatbotSessionId = participantIds[0];
    const videoTrackState = useVideoTrack(chatbotSessionId);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoTrackState?.track && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = new MediaStream([videoTrackState.track]);
      }
    }, [videoTrackState]);

    useEffect(() => {
      if (participantIds.length > 0) {
        setAgentState("connected");
      } else {
        setAgentState("connecting");
      }
    }, [participantIds.length]);

    const cx = clsx(
      styles.agentWindow,
      agentState === "connected" && styles.connected
    );

    return (
      <div className={styles.agent}>
        <div className={cx} style={{ backgroundColor: 'white' }}>
          {agentState === "connecting" ? (
            <span className={styles.loader}>
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
          )}
          {/* <Transcript /> */}
        </div>
        <footer className={styles.agentFooter}>
          <Latency
            started={agentState === "connected" && hasStarted}
            botStatus={agentState}
            statsAggregator={statsAggregator}
          />
        </footer>
      </div>
    );
  },
  (p, n) => p.hasStarted === n.hasStarted
);

export default Agent;

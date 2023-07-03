import type { RoomModel, UserOnRoomModel } from '$/commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './infopanel.module.css';

const InfoPanel = () => {
  const router = useRouter();
  const { roomid } = router.query;
  const [userOnRoomData, setUserOnRoomData] = useState<UserOnRoomModel | null>();
  const [roomData, setRoomData] = useState<RoomModel | null>();
  const [isEnded, setIsEnded] = useState(false);

  const fetchUserOnRoom = async () => {
    if (typeof roomid !== 'string') return;
    const useronrooms = await apiClient.rooms.useronrooms.$get();
    setUserOnRoomData(useronrooms);
  };
  const fetchRoom = async () => {
    if (typeof roomid !== 'string') return;
    const room = await apiClient.rooms.post({ body: { roomid } });

    setRoomData(room.body);
    if (room.body?.status === 'ended') setIsEnded(true);
  };
  useEffect(() => {
    const getRoom = setInterval(fetchRoom, 500);
    const getUserOnRoom = setInterval(fetchUserOnRoom, 500);
    return () => {
      clearInterval(getRoom);
      clearInterval(getUserOnRoom);
    };
  }, []);

  if (!userOnRoomData)
    return (
      <div className={styles.infoPanel}>
        <p>status:{roomData?.status}</p>
        <p>あなたは観戦者です</p>
      </div>
    );
  if (isEnded)
    return (
      <div className={styles.infoPanel}>
        <p>status:{roomData?.status}</p>
        <p>この試合は終了しました</p>
      </div>
    );
  else
    return (
      <div className={styles.infoPanel}>
        <p>userid:{userOnRoomData.firebaseId}</p>
        <p>roomid:{userOnRoomData.roomId}</p>
        <p>in時刻:{userOnRoomData.in}</p>
        <p>out時刻:{userOnRoomData.out}</p>
        <p>status:{roomData?.status}</p>
        <p>created_at:{roomData?.created}</p>
      </div>
    );
};

export default InfoPanel;

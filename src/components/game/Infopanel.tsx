import type { RoomModel, UserOnRoomModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import styles from './infopanel.module.css';

const InfoPanel = () => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const { roomid } = router.query;
  const [userOnRoomData, setUserOnRoomData] = useState<UserOnRoomModel | null>();
  const [roomData, setRoomData] = useState<RoomModel | null>();

  const fetchUserOnRoom = async () => {
    if (typeof roomid !== 'string') return;
    const useronrooms = await apiClient.rooms.useronrooms.$get();
    console.log(useronrooms);
    setUserOnRoomData(useronrooms);
  };
  const fetchRoom = async () => {
    if (typeof roomid !== 'string') return;
    const room = await apiClient.rooms.post({ body: { roomid } });
    console.log(room);
    setRoomData(room.body);
  };
  useEffect(() => {
    fetchRoom();
    fetchUserOnRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!userOnRoomData) return <p>loading</p>;
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

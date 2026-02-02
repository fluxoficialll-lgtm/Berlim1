import { useState, useEffect } from 'react';
import { Group } from '../../../../types';

export const useGroupModeration = (group: Group | null) => {
  const [onlyAdminsPost, setOnlyAdminsPost] = useState(false);
  const [msgSlowMode, setMsgSlowMode] = useState(false);
  const [msgSlowModeInterval, setMsgSlowModeInterval] = useState('30');
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
  const [approveMembers, setApproveMembers] = useState(false);
  // Add: Missing memberLimit field required by GroupModerationPage
  const [memberLimit, setMemberLimit] = useState<number | ''>('');

  useEffect(() => {
    if (group?.settings) {
      const s = group.settings;
      setOnlyAdminsPost(s.onlyAdminsPost || false);
      setMsgSlowMode(s.msgSlowMode || false);
      setMsgSlowModeInterval(s.msgSlowModeInterval?.toString() || '30');
      setForbiddenWords(s.forbiddenWords || []);
      setApproveMembers(s.approveMembers || false);
      setMemberLimit(s.memberLimit || '');
    }
  }, [group]);

  return {
    state: { onlyAdminsPost, msgSlowMode, msgSlowModeInterval, forbiddenWords, approveMembers, memberLimit },
    actions: { setOnlyAdminsPost, setMsgSlowMode, setMsgSlowModeInterval, setForbiddenWords, setApproveMembers, setMemberLimit },
    getModerationPayload: () => ({
      settings: {
        onlyAdminsPost,
        msgSlowMode,
        msgSlowModeInterval: parseInt(msgSlowModeInterval),
        forbiddenWords,
        approveMembers,
        memberLimit: memberLimit === '' ? undefined : Number(memberLimit)
      }
    })
  };
};
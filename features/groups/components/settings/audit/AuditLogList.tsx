
import React from 'react';
import { AuditLog } from '../../../../../types';
import { AuditLogItem } from './AuditLogItem';
import { AuditLogEmptyState } from './AuditLogEmptyState';

interface AuditLogListProps {
    logs: AuditLog[];
}

export const AuditLogList: React.FC<AuditLogListProps> = ({ logs }) => {
    return (
        <div className="space-y-4">
            {logs.length > 0 ? (
                logs.map(log => <AuditLogItem key={log.id} log={log} />)
            ) : (
                <AuditLogEmptyState />
            )}
        </div>
    );
};

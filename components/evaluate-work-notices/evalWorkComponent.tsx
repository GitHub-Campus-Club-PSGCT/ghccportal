"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
} from "@nextui-org/react";

interface WorkNotice {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string;
  submitted_at: string;
}

interface EvaluateWorkNoticesTableProps {
  workNotices: WorkNotice[];
  approveWorkNotice: (
    noticeId: string,
    points: number
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function EvaluateWorkNoticesTable({
  workNotices,
  approveWorkNotice,
}: EvaluateWorkNoticesTableProps) {
  const [points, setPoints] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleApprove = async (noticeId: string) => {
    setLoading({ ...loading, [noticeId]: true });
    const result = await approveWorkNotice(noticeId, points[noticeId] || 0);
    setLoading({ ...loading, [noticeId]: false });
    if (result.success) {
      // You might want to update the UI here, e.g., remove the approved notice from the list
      alert("Work notice approved successfully!");
    } else {
      alert(result.error || "Failed to approve work notice");
    }
  };

  return (
    <Table aria-label="Work notices evaluation table">
      <TableHeader>
        <TableColumn>TITLE</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>SUBMITTED</TableColumn>
        <TableColumn>POINTS</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {workNotices.map((notice) => (
          <TableRow key={notice.id}>
            <TableCell>{notice.title}</TableCell>
            <TableCell>{notice.description}</TableCell>
            <TableCell>{notice.status}</TableCell>
            <TableCell>
              {new Date(notice.submitted_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={points[notice.id] || ""}
                onChange={(e) =>
                  setPoints({
                    ...points,
                    [notice.id]: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter points"
              />
            </TableCell>
            <TableCell>
              <Button
                color="success"
                onClick={() => handleApprove(notice.id)}
                disabled={notice.status === "approved" || loading[notice.id]}
              >
                {loading[notice.id] ? "Approving..." : "Approve"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

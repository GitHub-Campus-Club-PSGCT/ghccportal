import { DBClient } from "@/utils/turso";

export interface WorkNotice {
  id: string;
  user_id: string;
  title: string;
  description: string;
  file_url: string | null;
  points: number | null;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  approved_at: string | null;
  approved_by: string | null;
  submitter_name?: string;
}

export class DBFunctions {
  private client = DBClient();

  // Profiles
  async createProfile(
    userId: string,
    fullName: string,
    bio?: string,
    avatarUrl?: string
  ) {
    const result = await this.client.execute({
      sql: "INSERT INTO profiles (id, user_id, full_name, bio, avatar_url, role) VALUES (?, ?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        userId,
        fullName,
        bio || null,
        avatarUrl || null,
        "member",
      ],
    });

    return result.rowsAffected === 1;
  }

  async getProfile(userId: string) {
    const result = await this.client.execute({
      sql: "SELECT * FROM profiles WHERE user_id = ?",
      args: [userId],
    });

    return result.rows[0];
  }

  async updateProfile(
    userId: string,
    updates: Partial<{
      fullName: string;
      bio: string;
      avatarUrl: string;
      role: string;
    }>
  ) {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const result = await this.client.execute({
      sql: `UPDATE profiles SET ${setClause} WHERE user_id = ?`,
      args: [...Object.values(updates), userId],
    });

    return result.rowsAffected === 1;
  }

  async deleteProfile(userId: string) {
    const result = await this.client.execute({
      sql: "DELETE FROM profiles WHERE user_id = ?",
      args: [userId],
    });

    return result.rowsAffected === 1;
  }

  // Meetings
  async createMeeting(
    title: string,
    description: string,
    startTime: string,
    endTime: string,
    location: string,
    createdBy: string
  ) {
    const result = await this.client.execute({
      sql: "INSERT INTO meetings (id, title, description, start_time, end_time, location, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        title,
        description,
        startTime,
        endTime,
        location,
        createdBy,
      ],
    });

    return result.rowsAffected === 1;
  }

  async getMeeting(meetingId: string) {
    const result = await this.client.execute({
      sql: "SELECT * FROM meetings WHERE id = ?",
      args: [meetingId],
    });

    return result.rows[0];
  }

  async updateMeeting(
    meetingId: string,
    updates: Partial<{
      title: string;
      description: string;
      startTime: string;
      endTime: string;
      location: string;
    }>
  ) {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const result = await this.client.execute({
      sql: `UPDATE meetings SET ${setClause} WHERE id = ?`,
      args: [...Object.values(updates), meetingId],
    });

    return result.rowsAffected === 1;
  }

  async deleteMeeting(meetingId: string) {
    const result = await this.client.execute({
      sql: "DELETE FROM meetings WHERE id = ?",
      args: [meetingId],
    });

    return result.rowsAffected === 1;
  }

  // Meeting Attendees
  async addMeetingAttendee(
    meetingId: string,
    userId: string,
    rsvpStatus: "yes" | "no" | "maybe"
  ) {
    const result = await this.client.execute({
      sql: "INSERT INTO meeting_attendees (id, meeting_id, user_id, rsvp_status) VALUES (?, ?, ?, ?)",
      args: [crypto.randomUUID(), meetingId, userId, rsvpStatus],
    });

    return result.rowsAffected === 1;
  }

  async updateMeetingAttendee(
    meetingId: string,
    userId: string,
    rsvpStatus: "yes" | "no" | "maybe"
  ) {
    const result = await this.client.execute({
      sql: "UPDATE meeting_attendees SET rsvp_status = ? WHERE meeting_id = ? AND user_id = ?",
      args: [rsvpStatus, meetingId, userId],
    });

    return result.rowsAffected === 1;
  }

  async removeMeetingAttendee(meetingId: string, userId: string) {
    const result = await this.client.execute({
      sql: "DELETE FROM meeting_attendees WHERE meeting_id = ? AND user_id = ?",
      args: [meetingId, userId],
    });

    return result.rowsAffected === 1;
  }

  // Work Notices
  async createWorkNotice(
    userId: string,
    title: string,
    description: string,
    fileUrl?: string
  ): Promise<boolean> {
    const result = await this.client.execute({
      sql: `
        INSERT INTO work_notices (id, user_id, title, description, file_url, status, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        crypto.randomUUID(),
        userId,
        title,
        description,
        fileUrl || null,
        "pending",
      ],
    });

    return result.rowsAffected === 1;
  }

  async getAllWorkNotices(): Promise<WorkNotice[]> {
    const result = await this.client.execute({
      sql: `
        SELECT wn.*, p.full_name as submitter_name
        FROM work_notices wn
        JOIN profiles p ON wn.user_id = p.user_id
        ORDER BY wn.submitted_at DESC
      `,
      args: [],
    });

    return result.rows.map((row) => this.rowToWorkNotice(row));
  }

  async getWorkNotice(noticeId: string): Promise<WorkNotice | undefined> {
    const result = await this.client.execute({
      sql: "SELECT * FROM work_notices WHERE id = ?",
      args: [noticeId],
    });

    return result.rows[0] ? this.rowToWorkNotice(result.rows[0]) : undefined;
  }

  async approveWorkNotice(
    noticeId: string,
    points: number,
    approvedBy: string
  ): Promise<boolean> {
    // Start a transaction
    await this.client.execute({ sql: "BEGIN", args: [] });

    try {
      // Update the work notice
      const updateNoticeResult = await this.client.execute({
        sql: `
          UPDATE work_notices
          SET status = 'approved', points = ?, approved_at = CURRENT_TIMESTAMP, approved_by = ?
          WHERE id = ?
        `,
        args: [points, approvedBy, noticeId],
      });

      if (updateNoticeResult.rowsAffected !== 1) {
        throw new Error("Failed to update work notice");
      }

      // Get the user_id of the work notice
      const getNoticeResult = await this.client.execute({
        sql: "SELECT user_id FROM work_notices WHERE id = ?",
        args: [noticeId],
      });

      const userId = getNoticeResult.rows[0]?.user_id;

      if (!userId) {
        throw new Error("Work notice not found");
      }

      // Update the user's total points
      const updateProfileResult = await this.client.execute({
        sql: `
          UPDATE profiles
          SET total_points = COALESCE(total_points, 0) + ?
          WHERE user_id = ?
        `,
        args: [points, userId],
      });

      if (updateProfileResult.rowsAffected !== 1) {
        throw new Error("Failed to update user's total points");
      }

      // Commit the transaction
      await this.client.execute({ sql: "COMMIT", args: [] });

      return true;
    } catch (error) {
      // Rollback the transaction if any error occurs
      await this.client.execute({ sql: "ROLLBACK", args: [] });
      this.logError("Error in approveWorkNotice:", error);

      return false;
    }
  }

  async getUserWorkNotices(userId: string): Promise<WorkNotice[]> {
    const result = await this.client.execute({
      sql: "SELECT * FROM work_notices WHERE user_id = ? ORDER BY submitted_at DESC",
      args: [userId],
    });

    return result.rows.map((row) => this.rowToWorkNotice(row));
  }

  async getUserTotalPoints(userId: string): Promise<number> {
    const result = await this.client.execute({
      sql: "SELECT total_points FROM profiles WHERE user_id = ?",
      args: [userId],
    });

    const totalPoints = result.rows[0]?.total_points;

    if (totalPoints === undefined || totalPoints === null) {
      return 0;
    }

    // Ensure the result is converted to a number
    const numericTotalPoints = Number(totalPoints);

    // Check if the conversion resulted in a valid number
    if (isNaN(numericTotalPoints)) {
      this.logError("Invalid total_points value in database", {
        userId,
        totalPoints,
      });
      return 0;
    }

    return numericTotalPoints;
  }

  private rowToWorkNotice(row: any): WorkNotice {
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      file_url: row.file_url,
      points: row.points ? Number(row.points) : null,
      status: row.status,
      submitted_at: row.submitted_at,
      approved_at: row.approved_at,
      approved_by: row.approved_by,
      submitter_name: row.submitter_name,
    };
  }

  private logError(message: string, error: unknown): void {
    // Implement your custom error logging here
    // For example, you could use a logging service or write to a file
    // For now, we'll just log to console, but you should replace this with a proper logging solution
    console.error(message, error);
  }
}

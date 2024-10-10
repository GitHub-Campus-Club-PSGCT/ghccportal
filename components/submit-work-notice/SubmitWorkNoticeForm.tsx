"use client";

import React, { useState } from "react";
import { Button, Input, Textarea } from "@nextui-org/react";

interface SubmitWorkNoticeFormProps {
  submitWorkNotice: (formData: FormData) => Promise<void>;
}

export default function SubmitWorkNoticeForm({
  submitWorkNotice,
}: SubmitWorkNoticeFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (fileUrl) formData.append("fileUrl", fileUrl);
    await submitWorkNotice(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter the title of your work"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        label="Description"
        placeholder="Describe your work in detail"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        label="File URL (optional)"
        placeholder="Enter a URL to your work file"
        type="url"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />
      <Button color="primary" type="submit">
        Submit Work Notice
      </Button>
    </form>
  );
}

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`/submissions/${id}`);
      setSubmission(res.data.data);
    };

    fetch();
  }, [id]);

  if (!submission) return <div>Loading...</div>;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Submission Details
      </h1>

      <div>
        Status: {submission.status}
      </div>

      <div>
        Runtime: {submission.runtime} ms
      </div>

      <Editor
        height="500px"
        language={submission.language}
        value={submission.code}
        options={{ readOnly: true }}
      />

    </div>
  );
};

export default SubmissionDetailPage;
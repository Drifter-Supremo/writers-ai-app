import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../services/firebase";

export default function ProjectFiles({ files, onDeleteFile, deletingFileId, projectId, refreshFiles }) {
  const fileInputRef = useRef();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  // Show skeletons when uploading, deleting, or files is undefined (loading)
  const showSkeletons = uploading || deletingFileId || files === undefined;

  // Real upload logic
  const handleUploadFile = async (file) => {
    // Client-side validation
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg"
    ];
    const maxSizeMB = 10;
    if (!allowedTypes.includes(file.type)) {
      alert("File type not allowed. Please upload PDF, TXT, DOCX, PNG, JPG, or JPEG files.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    try {
      // 1. Check for duplicate file name
      const existing = files.find(f => f.name === file.name);
      let fileName = file.name;
      if (existing) {
        const timestamp = Date.now();
        const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
        fileName = file.name.replace(ext, "") + `_${timestamp}` + ext;
      }

      // 2. Upload to Storage
      const fileRef = storageRef(storage, `users/${user.uid}/projects/${projectId}/files/${fileName}`);
      await uploadBytes(fileRef, file);

      // 3. Get download URL
      const url = await getDownloadURL(fileRef);

      // 4. Save to Firestore
      await addDoc(collection(db, `projects/${projectId}/files`), {
        name: fileName,
        url,
        type: file.type,
        createdAt: serverTimestamp(),
        userId: user?.uid || null
      });

      // 5. Refresh files
      if (refreshFiles) refreshFiles();
    } catch (error) {
      if (error.code === "storage/quota-exceeded") {
        alert("Upload failed: Firebase Storage quota exceeded.");
      } else if (error.code === "storage/unauthorized") {
        alert("Upload failed: You do not have permission to upload files.");
      } else {
        alert("Failed to upload file.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Use text-text-primary (updated via index.css) */}
      <h2 className="text-2xl font-bold text-gradient mb-6">Files</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (fileInputRef.current && fileInputRef.current.files[0]) {
            handleUploadFile(fileInputRef.current.files[0]);
            setSelectedFileName("");
            fileInputRef.current.value = "";
          }
        }}
        className="flex flex-col items-start gap-2 mb-8"
      >
        {/* Use .btn-creative */}
        <label className="btn-creative px-3 py-1.5 text-sm cursor-pointer text-center w-auto min-w-[140px]">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
            disabled={uploading}
            className="hidden"
            onChange={e => setSelectedFileName(e.target.files[0]?.name || "")}
          />
          Choose File
        </label>
        {/* Use new text color */}
        <div className="text-text-secondary text-sm min-h-[1.5em] mb-1">
          {selectedFileName || "No file chosen"}
        </div>
        {/* Use .btn-creative */}
        <button
          type="submit"
          className="btn-creative px-3 py-1.5 text-sm w-auto min-w-[140px]"
          disabled={uploading || !selectedFileName}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            // Use .card-creative and dark theme skeleton colors
            <div
              key={idx}
              className="card-creative p-6 flex flex-col items-center animate-pulse"
            >
              <div className="h-10 w-10 bg-card-bg/70 rounded-full mb-2"></div>
              <div className="h-4 w-2/3 bg-card-bg/70 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-card-bg/70 rounded"></div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        // Use new text color
        <p className="text-text-secondary text-center py-8">No files uploaded yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {files.map((file) => (
            // Use .card-creative
            <div
              key={file.id}
              className="card-creative p-6 flex flex-col items-center relative"
            >
              {/* Use new text color for icon */}
              <div className="text-4xl mb-2 text-text-primary">📄</div>
              {/* Use new text color */}
              <div className="font-semibold text-text-primary mb-2 text-center break-all">
                {file.name}
              </div>
              {/* Use .btn-creative */}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-creative px-3 py-1.5 text-sm mt-2 w-full text-center"
              >
                View File
              </a>
              {onDeleteFile && (
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
                      onDeleteFile(file);
                    }
                  }}
                   // Use new error status colors
                  className="absolute top-3 right-3 text-status-error hover:text-status-error/80 transition-colors duration-200"
                  title="Delete file"
                  disabled={deletingFileId === file.id}
                >
                  {deletingFileId === file.id ? (
                    // Use error status color for spinner
                    <svg className="animate-spin h-5 w-5 text-status-error" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <>🗑️</>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

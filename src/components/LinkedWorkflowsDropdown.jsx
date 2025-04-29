// FILE: src/components/LinkedWorkflowsDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";

export default function LinkedWorkflowsDropdown({ projectId, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    const fetchWorkflows = async () => {
      try {
        const q = query(
          collection(db, "characterWorkflows"),
          where("userId", "==", userId),
          where("linkedProjectId", "==", projectId)
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setWorkflows(data);
      } catch (err) {
        setWorkflows([]);
      }
      setIsLoading(false);
    };
    fetchWorkflows();
  }, [isOpen, projectId, userId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNavigate = (workflow) => {
    const dest = workflow.completed
      ? `/character-workflow?id=${workflow.id}&view=1`
      : `/character-workflow?id=${workflow.id}`;
    setIsOpen(false);
    navigate(dest);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="bg-teal-light border border-cream-yellow/30 text-cream-yellow px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-2 hover:bg-teal-light/80 transition-all"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        Linked Workflows
        <svg className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-2 w-56 bg-teal-light border border-cream-yellow/30 rounded-md shadow-lg py-1 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 text-cream-gray text-sm">
              <span className="w-3 h-3 rounded-full border-2 border-orange-vibrant border-t-transparent animate-spin"></span>
              Loading…
            </div>
          ) : workflows.length === 0 ? (
            <div className="px-4 py-2 text-cream-gray text-sm cursor-not-allowed select-none">
              No workflows linked
            </div>
          ) : (
            workflows.map((workflow) => (
              <button
                key={workflow.id}
                className="w-full flex items-center gap-2 px-4 py-2 text-left text-cream-yellow hover:bg-orange-vibrant/10 transition-colors text-sm"
                onClick={() => handleNavigate(workflow)}
                tabIndex={0}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    workflow.completed ? "bg-green-500" : "bg-yellow-400"
                  }`}
                ></span>
                <span className="truncate">{workflow.name || "Untitled Workflow"}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

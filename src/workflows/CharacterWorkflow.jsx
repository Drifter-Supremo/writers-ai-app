import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WorkflowEngine from './components/WorkflowEngine';
import { characterWorkflowConfig } from './configs/characterWorkflowConfig';

// Optional: Import Layout component if needed, or assume it's handled globally
// import Layout from '../components/Layout';

function CharacterWorkflow() {
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const isViewMode = searchParams.get('view') === '1'; // Check for view mode flag
  // Optional: Get projectId if needed later, e.g., from workflow document itself or another param
  // const projectId = searchParams.get('projectId');

  if (!workflowId) {
    return <div className="p-8 text-red-500">Error: Workflow ID is missing from URL.</div>;
  }

  // Optional: Wrap with Layout if needed
  // return (
  //   <Layout>
  //     <div className="p-8 max-w-6xl mx-auto">
  //       <WorkflowEngine
  //         config={characterWorkflowConfig}
  //         workflowId={workflowId}
  //         isViewMode={isViewMode} // Pass view mode status down
  //         // projectId={projectId} // Pass if available and needed
  //       />
  //     </div>
  //   </Layout>
  // );

  return (
    // Apply negative top margin to counteract Layout padding
    <div className="px-8 max-w-6xl mx-auto -mt-6"> {/* Added -mt-6 (adjust value if needed) */}
      <WorkflowEngine
        config={characterWorkflowConfig}
        workflowId={workflowId}
        isViewMode={isViewMode} // Pass view mode status down
        // projectId={projectId} // Pass if available and needed
      />
    </div>
  );
}

export default CharacterWorkflow;
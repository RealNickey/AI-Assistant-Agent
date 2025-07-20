import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { InformationIcon, VercelIcon } from "./icons";

const ProjectOverview = () => {
  return (
    <motion.div
      className="w-full max-w-[600px] my-4"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 5 }}
    >
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-neutral-500 text-sm dark:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="flex flex-row justify-center gap-4 items-center text-neutral-900 dark:text-neutral-50">
          <VercelIcon size={16} />
          <span>+</span>
          <InformationIcon />
          <span>+</span>
          <span className="text-blue-500 font-semibold">Multi-AI</span>
        </p>
        <p>
          Enhanced AI assistant with <strong>multi-provider support</strong> - seamlessly switch between{" "}
          <span className="text-blue-600 font-medium">OpenAI GPT-4</span> and{" "}
          <span className="text-green-600 font-medium">Google Gemini</span> with intelligent fallback and provider selection.
        </p>
        <p>
          Features <strong>Retrieval Augmented Generation (RAG)</strong> with vector embeddings, smart provider routing, and enhanced error handling for optimal performance and reliability.
        </p>
        <p>
          Built with{" "}
          <Link
            href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat"
            className="text-blue-500"
          >
            AI SDK
          </Link>,{" "}
          <Link
            href="https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text"
            className="text-blue-500"
          >
            streamText
          </Link>, DrizzleORM, and PostgreSQL with advanced provider management.
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectOverview;

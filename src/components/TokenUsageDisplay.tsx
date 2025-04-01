import React from "react";
import { TokenUsage } from "../types";

interface TokenUsageDisplayProps {
  totalTokens: TokenUsage;
}

const TokenUsageDisplay: React.FC<TokenUsageDisplayProps> = ({
  totalTokens,
}) => {
  return (
    <div className="fixed top-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg text-xs z-10">
      <div className="font-medium mb-1">Token Usage (estimated):</div>
      <div>Google: {totalTokens.google} tokens</div>
      <div>Groq: {totalTokens.groq} tokens</div>
    </div>
  );
};

export default TokenUsageDisplay;

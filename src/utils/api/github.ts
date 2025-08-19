import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export interface GitHubConfig {
  owner: string;
  repo: string;
}

export function validateGitHubConfig(): GitHubConfig | NextResponse {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!owner || !repo) {
    return NextResponse.json(
      { message: "GitHub 리포지토리 설정이 필요합니다." },
      { status: 500 },
    );
  }

  return { owner, repo };
}

export interface CommitterInfo {
  name: string;
  email: string;
}

export function getCommitterInfo(user?: {
  name?: string | null;
  email?: string | null;
}): CommitterInfo {
  return {
    name: user?.name || "Anonymous",
    email: user?.email || "anonymous@example.com",
  };
}

export async function getFileSHA(
  octokit: Octokit,
  config: GitHubConfig,
  path: string,
): Promise<string | null> {
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
    });

    if ("sha" in fileData) {
      return fileData.sha;
    }
    return null;
  } catch (error) {
    console.error("Error getting file SHA:", error);
    return null;
  }
}

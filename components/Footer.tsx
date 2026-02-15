import Link from "next/link";
import { FOOTER } from "@/constants";

export default function Footer() {
  return (
    <footer className="app-footer fixed bottom-0 left-0 right-0 z-10 border-t border-dark-300/60 bg-dark-100/95 px-4 py-6 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-light-200">
              Created by{" "}
              <Link
                href={FOOTER.creatorLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                {FOOTER.creatorName}
              </Link>
              <span className="ml-1.5 text-light-500">· v{FOOTER.version}</span>
            </p>
            <p className="text-xs text-light-500">{FOOTER.tagline}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-light-500">
              {FOOTER.techStack.map((tech, i) => (
                <span key={tech}>
                  {tech}
                  {i < FOOTER.techStack.length - 1 && (
                    <span className="ml-3 hidden sm:inline">·</span>
                  )}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0 text-[11px] text-light-600">
              <span className="font-medium text-light-500">Backend & serverless:</span>
              {FOOTER.backendServerless.map((tech, i) => (
                <span key={tech}>
                  {tech}
                  {i < FOOTER.backendServerless.length - 1 && (
                    <span className="ml-2 hidden sm:inline">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        {FOOTER.creatorGitHub && (
          <p className="mt-3 text-center text-xs text-light-500 sm:mt-2">
            <Link
              href={FOOTER.creatorGitHub}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View source on GitHub
            </Link>
          </p>
        )}
      </div>
    </footer>
  );
}

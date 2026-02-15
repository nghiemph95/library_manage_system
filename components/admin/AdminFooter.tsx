import Link from "next/link";
import { FOOTER } from "@/constants";

export default function AdminFooter() {
  return (
    <footer className="admin-footer fixed bottom-0 left-0 right-0 z-10 border-t border-light-600 bg-white/95 px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur-sm md:left-[264px]">
      <div className="flex flex-col items-center gap-2 text-center text-sm text-dark-200 sm:flex-row sm:justify-between sm:text-left">
        <p>
          Created by{" "}
          <Link
            href={FOOTER.creatorLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-admin underline-offset-2 hover:underline"
          >
            {FOOTER.creatorName}
          </Link>
          <span className="text-dark-400"> · v{FOOTER.version}</span>
        </p>
        <p className="text-xs text-dark-400">{FOOTER.tagline}</p>
      </div>
      <div className="mt-2 flex flex-col gap-1 sm:items-end">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-0 text-xs text-dark-400 sm:justify-end">
          {FOOTER.techStack.map((tech, i) => (
            <span key={tech}>
              {tech}
              {i < FOOTER.techStack.length - 1 && " · "}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-0 text-[11px] text-dark-400 sm:justify-end">
          <span className="font-medium text-dark-500">Backend & serverless:</span>
          {FOOTER.backendServerless.map((tech, i) => (
            <span key={tech}>
              {tech}
              {i < FOOTER.backendServerless.length - 1 && " · "}
            </span>
          ))}
        </div>
      </div>
      {FOOTER.creatorGitHub && (
        <p className="mt-2 text-center text-xs text-dark-400 sm:text-right">
          <Link
            href={FOOTER.creatorGitHub}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-admin hover:underline"
          >
            View source
          </Link>
        </p>
      )}
    </footer>
  );
}

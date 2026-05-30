import { useState } from "react";
import styles from "./Experience.module.css";
import { ExperienceModal } from "./ExperienceModal";
import {
  useLimelightStore,
  getHighlightStyle,
} from "../store/useLimelightStore";
import portfolioData from "../data/portfolio.json";

interface ExperienceItem {
  id: string;
  year: string;
  company: string;
  role: string;
  details: string[];
  active?: boolean;
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "exp_gohappy",
    year: "JUL 2024 — MAY 2026",
    company: "GoHappy Club",
    role: "Full Stack Developer",
    details: [
      "Mobile: Architected and built the entire iOS and Android application serving over 30,000 active senior citizen users.",
      "Backend: Designed and deployed a tiered subscription membership model driving revenue conversion across 30,000+ users.",
      "Web/Admin: Engineered a single-page web application and a comprehensive operations portal featuring 22 distinct feature pages.",
    ],
    active: true,
  },
  {
    id: "exp_drupsc",
    year: "JUN 2024 — JAN 2025",
    company: "Dr. UPSC",
    role: "Frontend Developer (Founding Hire)",
    details: [
      "Architecture: Scaled the Next.js web platform from scratch to successfully serve over 15,000 active users.",
      "Security: Implemented secure Widevine/DRM content delivery utilizing shaka-player and a dynamic student watermark.",
      "Proctoring: Built an anti-cheat proctoring listener tracking browser focus and blur status to enforce exam integrity.",
    ],
  },
  {
    id: "edu_skit",
    year: "2022 — MAY 2026",
    company: "SKIT Jaipur",
    role: "B.Tech in Computer Science",
    details: [
      "Academics: Graduated with a CGPA of 8.48.",
      "Coursework: Data Structures & Algorithms, System Design, DBMS, Operating Systems, and Object-Oriented Programming.",
    ],
  },
];

export function Experience() {
  const highlightedProjectIds = useLimelightStore(
    (state) => state.highlightedProjectIds,
  );
  const setProjectDetailsOpen = useLimelightStore(
    (state) => state.setProjectDetailsOpen,
  );
  const [selectedExperience, setSelectedExperience] = useState<any | null>(
    null,
  );

  const handleRowClick = (item: ExperienceItem) => {
    const matchedNode = portfolioData.nodes.find((node) => node.id === item.id);

    const tagList: string[] = [];
    if (matchedNode && matchedNode.connections) {
      matchedNode.connections.forEach((connId) => {
        const skillNode = portfolioData.nodes.find(
          (n) => n.id === connId && n.group === "skill",
        );
        if (skillNode) {
          tagList.push(skillNode.label);
        }
      });
    }

    const details = {
      id: item.id,
      company: item.company,
      role: matchedNode?.drawerDetails?.role || item.role,
      timeline: matchedNode?.drawerDetails?.timeline || item.year,
      description:
        matchedNode?.drawerDetails?.description || item.details.join(" "),
      tags: tagList.length > 0 ? tagList : [],
      status: item.active ? "ACTIVE" : "COMPLETED",
      live: matchedNode?.drawerDetails?.live || null,
      github: matchedNode?.drawerDetails?.github || null,
      workstreams: matchedNode?.drawerDetails?.workstreams || undefined,
    };

    setSelectedExperience(details);
    setProjectDetailsOpen(true);
  };

  return (
    <section className={styles.section} id="experience">
      <div className={styles.header}>
        <span className={styles.label}>02 // CAREER_LOG</span>
        <h2 className={styles.title}>PROFESSIONAL_EXPERIENCE</h2>
      </div>

      <div className={styles.timelineContainer}>
        <div className={styles.timelineLine}></div>

        {EXPERIENCE_DATA.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const isHighlighted = highlightedProjectIds.includes(item.id);
          const highlightIndex = highlightedProjectIds.indexOf(item.id);
          return (
            <div
              key={idx}
              className={`${styles.timelineRow} ${!isEven ? styles.timelineRowReverse : ""}`}
            >
              {/* Year for Desktop */}
              <div
                className={`${styles.timelineYearDesktop} ${
                  isEven ? styles.textRight : styles.textLeft
                }`}
              >
                <span className={styles.yearLabel}>{item.year}</span>
              </div>

              {/* Node Indicator */}
              <div
                className={`${styles.node} ${
                  item.active ? styles.nodeActive : styles.nodeInactive
                }`}
              ></div>

              {/* Content Panel */}
              <div
                id={item.id}
                className={`${styles.timelineContent} ${
                  !isEven ? styles.timelineContentReverse : ""
                } ${isHighlighted ? "project-highlight-active" : ""}`}
                style={
                  isHighlighted
                    ? getHighlightStyle(
                        item.id,
                        highlightIndex,
                        highlightedProjectIds.length,
                      )
                    : undefined
                }
                onClick={() => handleRowClick(item)}
              >
                {isHighlighted && (
                  <div className="source-tag" style={{ right: "0px" }}>
                    SOURCE_REF: DONNA_v1.0.2
                  </div>
                )}
                {/* Year for Mobile */}
                <span className={styles.timelineYearMobile}>{item.year}</span>

                <h3 className={styles.companyName}>{item.company}</h3>
                <p className={styles.roleTitle}>{item.role}</p>

                <ul className={styles.detailList}>
                  {item.details.map((detail, detailIdx) => (
                    <li key={detailIdx}>
                      <span className={styles.bullet}>•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      <ExperienceModal
        isOpen={selectedExperience !== null}
        onClose={() => {
          setSelectedExperience(null);
          setProjectDetailsOpen(false);
        }}
        experience={selectedExperience}
      />
    </section>
  );
}

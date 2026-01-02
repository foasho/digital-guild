"use client";

import { useState, useEffect } from "react";
import {
  skills as mockSkills,
  jobSkills as mockJobSkills,
  requirementSkills as mockRequirementSkills,
} from "@/constants/mocks";
import type { Skill, JobSkill, RequirementSkill } from "@/types";

/**
 * スキルマスタを取得するhook
 */
const useSkills = (): Skill[] => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    // TODO: 本番移行では、APIから取得する予定
    setSkills(mockSkills);
  }, []);

  return skills;
};

/**
 * ジョブに紐づくスキルを取得するhook
 */
const useJobSkills = (jobId: number): JobSkill[] => {
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);

  useEffect(() => {
    // TODO: 本番移行では、APIから取得する予定
    const filtered = mockJobSkills.filter((s) => s.jobId === jobId);
    setJobSkills(filtered);
  }, [jobId]);

  return jobSkills;
};

/**
 * ジョブの募集条件スキルを取得するhook
 */
const useRequirementSkills = (jobId: number): RequirementSkill[] => {
  const [requirementSkills, setRequirementSkills] = useState<
    RequirementSkill[]
  >([]);

  useEffect(() => {
    // TODO: 本番移行では、APIから取得する予定
    const filtered = mockRequirementSkills.filter((s) => s.jobId === jobId);
    setRequirementSkills(filtered);
  }, [jobId]);

  return requirementSkills;
};

export { useSkills, useJobSkills, useRequirementSkills };

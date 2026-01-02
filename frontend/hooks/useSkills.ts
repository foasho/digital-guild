"use client";

import { useState, useEffect } from "react";
import { SkillApi, JobSkillApi, RequirementSkillApi } from "@/constants/api-mocks";
import type { Skill, JobSkill, RequirementSkill } from "@/types";

/**
 * スキルマスタを取得するhook
 */
const useSkills = (): Skill[] => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async (): Promise<void> => {
      const list = await SkillApi.index();
      setSkills(list);
    };
    fetchSkills();
  }, []);

  return skills;
};

/**
 * ジョブに紐づくスキルを取得するhook
 */
const useJobSkills = (jobId: number): JobSkill[] => {
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);

  useEffect(() => {
    const fetchJobSkills = async (): Promise<void> => {
      const list = await JobSkillApi.getByJobId({ jobId });
      setJobSkills(list);
    };
    if (jobId) {
      fetchJobSkills();
    }
  }, [jobId]);

  return jobSkills;
};

/**
 * ジョブの募集条件スキルを取得するhook
 */
const useRequirementSkills = (jobId: number): RequirementSkill[] => {
  const [requirementSkills, setRequirementSkills] = useState<RequirementSkill[]>([]);

  useEffect(() => {
    const fetchRequirementSkills = async (): Promise<void> => {
      const list = await RequirementSkillApi.getByJobId({ jobId });
      setRequirementSkills(list);
    };
    if (jobId) {
      fetchRequirementSkills();
    }
  }, [jobId]);

  return requirementSkills;
};

export { useSkills, useJobSkills, useRequirementSkills };


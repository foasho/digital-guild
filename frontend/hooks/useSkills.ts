"use client";

import { useState, useEffect } from "react";
import { SkillApi, JobSkillApi, RequirementSkillApi } from "@/constants/api-mocks";
import type { Skill, JobSkill, RequirementSkill } from "@/types";

/**
 * スキルマスタを取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useSkills = (): Skill[] => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async (): Promise<void> => {
      const data = await SkillApi.index();
      setSkills(data);
    };
    fetchSkills();
  }, []);

  return skills;
};

/**
 * ジョブに紐づくスキルを取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useJobSkills = (jobId: number): JobSkill[] => {
  const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);

  useEffect(() => {
    const fetchJobSkills = async (): Promise<void> => {
      const data = await JobSkillApi.getByJobId({ jobId });
      setJobSkills(data);
    };
    fetchJobSkills();
  }, [jobId]);

  return jobSkills;
};

/**
 * ジョブの募集条件スキルを取得するhook
 * データ取得: hooks → API → LocalStorage
 */
const useRequirementSkills = (jobId: number): RequirementSkill[] => {
  const [requirementSkills, setRequirementSkills] = useState<
    RequirementSkill[]
  >([]);

  useEffect(() => {
    const fetchRequirementSkills = async (): Promise<void> => {
      const data = await RequirementSkillApi.getByJobId({ jobId });
      setRequirementSkills(data);
    };
    fetchRequirementSkills();
  }, [jobId]);

  return requirementSkills;
};

export { useSkills, useJobSkills, useRequirementSkills };

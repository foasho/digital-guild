"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import {
  Building2,
  CheckCircle2,
  Shield,
  CreditCard,
  ArrowRightLeft,
} from "lucide-react";

interface BankPartnerPanelProps {
  bankName?: string;
  isConnected?: boolean;
  kycStatus?: "verified" | "pending" | "not_started";
}

export function BankPartnerPanel({
  bankName = "原資地方銀行",
  isConnected = true,
  kycStatus = "verified",
}: BankPartnerPanelProps) {
  const getKycStatusLabel = () => {
    switch (kycStatus) {
      case "verified":
        return { label: "認証済み", color: "success" as const };
      case "pending":
        return { label: "審査中", color: "warning" as const };
      case "not_started":
        return { label: "未認証", color: "default" as const };
    }
  };

  const kycInfo = getKycStatusLabel();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm rounded-2xl overflow-hidden">
      <CardBody className="p-5">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">地方銀行連携</h3>
              <p className="text-xs text-gray-500">{bankName}</p>
            </div>
          </div>
          <Chip
            size="sm"
            color={isConnected ? "success" : "default"}
            variant="flat"
            startContent={
              isConnected ? <CheckCircle2 className="w-3 h-3" /> : null
            }
          >
            {isConnected ? "連携済み" : "未連携"}
          </Chip>
        </div>

        {/* 連携機能一覧 */}
        <div className="space-y-3">
          {/* KYC認証 */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">KYC本人確認</span>
            </div>
            <Chip size="sm" color={kycInfo.color} variant="flat">
              {kycInfo.label}
            </Chip>
          </div>

          {/* JPYC決済 */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">JPYC即時決済</span>
            </div>
            <Chip size="sm" color="success" variant="flat">
              有効
            </Chip>
          </div>

          {/* 円転換 */}
          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">法定通貨ゲートウェイ</span>
            </div>
            <Chip size="sm" color="success" variant="flat">
              有効
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

